use rquickjs::{CatchResultExt, Context, Function, Module, Persistent, Runtime};
use serde::Deserialize;

const BUNDLED_JS: &str = include_str!(concat!(env!("OUT_DIR"), "/entry.bundle.mjs"));

#[derive(Debug, Deserialize)]
pub struct ValidationError {
    pub path: String,
    pub message: String,
}

impl std::fmt::Display for ValidationError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}: {}", self.path, self.message)
    }
}

#[derive(Debug, Deserialize)]
pub struct ValidateResult {
    pub errors: Vec<ValidationError>,
    pub warnings: Vec<ValidationError>,
}

#[derive(Debug, Deserialize)]
struct GeneratedOutputs {
    css: String,
    json: String,
}

pub struct Js {
    // Field order matters: persistents must drop before context, context before runtime.
    // Rust drops struct fields in declaration order.
    validate_fn: Persistent<Function<'static>>,
    generate_fn: Persistent<Function<'static>>,
    context: Context,
    _runtime: Runtime,
}

impl Js {
    pub fn new() -> Result<Self, String> {
        let runtime = Runtime::new().map_err(|e| format!("quickjs runtime: {}", e))?;
        let context = Context::full(&runtime).map_err(|e| format!("quickjs context: {}", e))?;

        let (validate_fn, generate_fn) =
            context.with(|ctx| -> Result<(Persistent<Function<'static>>, Persistent<Function<'static>>), String> {
                let declared = Module::declare(ctx.clone(), "vs", BUNDLED_JS)
                    .catch(&ctx)
                    .map_err(|e| format!("declaring bundled module: {}", e))?;
                let (module, _promise) = declared
                    .eval()
                    .catch(&ctx)
                    .map_err(|e| format!("evaluating bundled module: {}", e))?;

                let validate: Function = module
                    .get("validate")
                    .map_err(|e| format!("missing `validate` export: {}", e))?;
                let generate: Function = module
                    .get("generate")
                    .map_err(|e| format!("missing `generate` export: {}", e))?;

                Ok((Persistent::save(&ctx, validate), Persistent::save(&ctx, generate)))
            })?;

        Ok(Js {
            validate_fn,
            generate_fn,
            context,
            _runtime: runtime,
        })
    }

    pub fn validate(&self, spec_str: &str) -> Result<ValidateResult, String> {
        let result = self.call(&self.validate_fn, "validate", spec_str)?;
        serde_json::from_str(&result)
            .map_err(|e| format!("validator returned invalid JSON: {}", e))
    }

    pub fn generate(&self, spec_str: &str) -> Result<(String, String), String> {
        let result = self.call(&self.generate_fn, "generate", spec_str)?;
        let outputs: GeneratedOutputs = serde_json::from_str(&result)
            .map_err(|e| format!("generator returned invalid JSON: {}", e))?;
        Ok((outputs.css, outputs.json))
    }

    fn call(
        &self,
        handle: &Persistent<Function<'static>>,
        name: &str,
        arg: &str,
    ) -> Result<String, String> {
        self.context.with(|ctx| -> Result<String, String> {
            let func = handle
                .clone()
                .restore(&ctx)
                .map_err(|e| format!("restoring {}: {}", name, e))?;
            let result: String = func
                .call((arg,))
                .catch(&ctx)
                .map_err(|e| format!("calling {}: {}", name, e))?;
            Ok(result)
        })
    }
}
