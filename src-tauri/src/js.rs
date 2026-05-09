use rquickjs::{CatchResultExt, Context, Function, Runtime};
use serde::Deserialize;

const BUNDLED_JS: &str = include_str!(concat!(env!("OUT_DIR"), "/generate.bundle.js"));

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
    _runtime: Runtime,
    context: Context,
}

impl Js {
    pub fn new() -> Result<Self, String> {
        let runtime = Runtime::new().map_err(|e| format!("quickjs runtime: {}", e))?;
        let context = Context::full(&runtime).map_err(|e| format!("quickjs context: {}", e))?;
        context.with(|ctx| -> Result<(), String> {
            ctx.eval::<(), _>(BUNDLED_JS)
                .catch(&ctx)
                .map_err(|e| format!("evaluating bundled script: {}", e))?;
            Ok(())
        })?;
        Ok(Js {
            _runtime: runtime,
            context,
        })
    }

    pub fn validate(&self, spec_str: &str) -> Result<ValidateResult, String> {
        let result_json = self.call("__vs_validate", spec_str)?;
        serde_json::from_str(&result_json)
            .map_err(|e| format!("validator returned invalid JSON: {}", e))
    }

    pub fn generate(&self, spec_str: &str) -> Result<(String, String), String> {
        let result_json = self.call("__vs_generate", spec_str)?;
        let outputs: GeneratedOutputs = serde_json::from_str(&result_json)
            .map_err(|e| format!("generator returned invalid JSON: {}", e))?;
        Ok((outputs.css, outputs.json))
    }

    fn call(&self, name: &str, arg: &str) -> Result<String, String> {
        self.context.with(|ctx| -> Result<String, String> {
            let func: Function = ctx
                .globals()
                .get(name)
                .map_err(|e| format!("bundled script did not define {}: {}", name, e))?;
            let result: String = func
                .call((arg,))
                .catch(&ctx)
                .map_err(|e| format!("calling {}: {}", name, e))?;
            Ok(result)
        })
    }
}
