use std::path::PathBuf;
use std::process::Command;

fn main() {
    bundle_quickjs_entry();
    tauri_build::build()
}

fn bundle_quickjs_entry() {
    let manifest_dir = PathBuf::from(std::env::var("CARGO_MANIFEST_DIR").unwrap());
    let project_root = manifest_dir.parent().unwrap().to_path_buf();
    let entry = manifest_dir.join("quickjs/entry.ts");

    let watch_paths = [
        "src-tauri/quickjs/entry.ts",
        "src/lib/generate/css.ts",
        "src/lib/generate/json.ts",
        "src/lib/spec.ts",
        "src/lib/reftype.ts",
        "src/lib/colors.ts",
        "src/lib/utils.ts",
        "src/lib/validate.ts",
    ];
    for p in &watch_paths {
        println!("cargo:rerun-if-changed={}", project_root.join(p).display());
    }

    let out_dir = PathBuf::from(std::env::var("OUT_DIR").unwrap());
    let outfile = out_dir.join("entry.bundle.mjs");

    let status = Command::new("bun")
        .arg("build")
        .arg("--bundle")
        .arg("--target=browser")
        .arg("--format=esm")
        .arg(&entry)
        .arg("--outfile")
        .arg(&outfile)
        .current_dir(&project_root)
        .status();

    match status {
        Ok(s) if s.success() => {}
        Ok(s) => panic!("bun build failed with exit code {:?}", s.code()),
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => {
            panic!("`bun` is required at build time to bundle the QuickJS entry. Install from https://bun.sh");
        }
        Err(e) => panic!("failed to run bun build: {}", e),
    }

    if !outfile.exists() {
        panic!("bun build did not produce {}", outfile.display());
    }
}
