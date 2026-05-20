// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use clap::{Parser, Subcommand};
use std::{fs, path::{Path, PathBuf}, process};

mod js;

#[derive(Parser)]
#[command(
    author,
    about,
    long_about = "Launch the Visual Source GUI.

If you haven't done so yet, run `visual-source init` to initialize Visual Source"
)]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    #[command(author, about = "Initializes Visual Source in the current directory")]
    Init {},
    #[command(about = "Validates manifest.json schema and reference integrity")]
    Validate {},
    #[command(about = "Regenerates visual-source.css and visual-source.json from manifest.json")]
    Regenerate {
        #[arg(long, help = "Skip validation before regenerating")]
        skip_validate: bool,
    },
    #[command(about = "Prints manifest.json to stdout (pretty-printed)")]
    Show {},
    #[command(about = "Prints the absolute path to manifest.json")]
    Path {},
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cli = Cli::parse();
    match cli.command {
        Some(Commands::Init {}) => run_init()?,
        Some(Commands::Validate {}) => run_validate()?,
        Some(Commands::Regenerate { skip_validate }) => run_regenerate(skip_validate)?,
        Some(Commands::Show {}) => run_show()?,
        Some(Commands::Path {}) => run_path()?,
        None => run_gui()?,
    }
    Ok(())
}

fn require_visual_source_dir() -> PathBuf {
    match find_visual_source_directory() {
        Some(dir) => dir,
        None => {
            eprintln!(
                "Visual Source not initialized in this directory tree. Run `visual-source init`."
            );
            process::exit(1);
        }
    }
}

fn read_manifest(dir: &PathBuf) -> Result<String, Box<dyn std::error::Error>> {
    let manifest_path = dir.join(MANIFEST_FILENAME);
    fs::read_to_string(&manifest_path)
        .map_err(|e| format!("failed to read {}: {}", manifest_path.display(), e).into())
}

fn run_validate() -> Result<(), Box<dyn std::error::Error>> {
    let dir = require_visual_source_dir();
    let spec_str = read_manifest(&dir)?;

    let runtime = js::Js::new().map_err(|e| format!("validate failed: {}", e))?;
    let result = runtime
        .validate(&spec_str)
        .map_err(|e| format!("validate failed: {}", e))?;

    for w in &result.warnings {
        eprintln!("warning {}", w);
    }
    if result.errors.is_empty() {
        return Ok(());
    }
    for e in &result.errors {
        eprintln!("{}", e);
    }
    eprintln!("\n{} validation error(s)", result.errors.len());
    process::exit(1);
}

fn run_regenerate(skip_validate: bool) -> Result<(), Box<dyn std::error::Error>> {
    let dir = require_visual_source_dir();
    let spec_str = read_manifest(&dir)?;

    let runtime = js::Js::new().map_err(|e| format!("regenerate failed: {}", e))?;

    if !skip_validate {
        let result = runtime
            .validate(&spec_str)
            .map_err(|e| format!("regenerate failed: {}", e))?;
        for w in &result.warnings {
            eprintln!("warning {}", w);
        }
        if !result.errors.is_empty() {
            for e in &result.errors {
                eprintln!("{}", e);
            }
            eprintln!(
                "\n{} validation error(s); refusing to regenerate. Use --skip-validate to override.",
                result.errors.len()
            );
            process::exit(1);
        }
    }

    let (css, json) = runtime
        .generate(&spec_str)
        .map_err(|e| format!("regenerate failed: {}", e))?;

    fs::write(dir.join("visual-source.css"), css)?;
    fs::write(dir.join("visual-source.json"), json)?;
    run_generate_hook(&dir)?;
    Ok(())
}

/// If a `generate` executable exists in the visual-source directory, run it
/// (with that directory as the working directory). Used as a user-defined
/// post-generation hook — e.g. to copy generated files elsewhere, run a
/// downstream build step, or commit the result.
fn run_generate_hook(dir: &Path) -> Result<(), Box<dyn std::error::Error>> {
    let hook = dir.join(GENERATE_HOOK_FILENAME);
    if !hook.exists() {
        return Ok(());
    }
    let output = std::process::Command::new(&hook)
        .current_dir(dir)
        .output()
        .map_err(|e| format!("failed to run {}: {}", hook.display(), e))?;
    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!(
            "{} exited with {}: {}",
            hook.display(),
            output.status,
            stderr.trim()
        )
        .into());
    }
    Ok(())
}

fn run_show() -> Result<(), Box<dyn std::error::Error>> {
    let dir = require_visual_source_dir();
    let spec_str = read_manifest(&dir)?;
    let spec: serde_json::Value = serde_json::from_str(&spec_str)
        .map_err(|e| format!("manifest.json is not valid JSON: {}", e))?;
    println!("{}", serde_json::to_string_pretty(&spec)?);
    Ok(())
}

fn run_path() -> Result<(), Box<dyn std::error::Error>> {
    let dir = require_visual_source_dir();
    println!("{}", dir.join(MANIFEST_FILENAME).display());
    Ok(())
}

fn current_dir() -> PathBuf {
    match std::env::var("VISUAL_SOURCE_ROOT") {
        Ok(root) => PathBuf::from(root),
        Err(_) => std::env::current_dir().unwrap(),
    }
}

fn find_visual_source_directory() -> Option<PathBuf> {
    let currdir = current_dir();
    let mut path = currdir.clone();
    loop {
        if path.join(VISUAL_SOURCE_DIR).exists() {
            return Some(path.join(VISUAL_SOURCE_DIR));
        }
        if !path.pop() {
            break;
        }
    }
    None
}

fn prompt_to_init_visual_source() -> Option<PathBuf> {
    // Visual source directory not found, see if we can find a sensible package
    // root by looking for a node_modules directory
    let mut path = current_dir().clone();
    loop {
        if path.join("node_modules").exists() {
            // Prompt the user to see if they want to initialise visual source
            let path_str = path.to_str().unwrap();
            println!("Would you like to initialize Visual Source in {path_str}? [y/N]");
            use std::io::{self, Write};
            io::stdout().flush().unwrap();
            let mut input = String::new();
            io::stdin().read_line(&mut input).unwrap();
            if input.trim().to_lowercase() == "y" {
                if init_visual_source(path.clone()).is_ok() {
                    return Some(path.join(VISUAL_SOURCE_DIR));
                }
            }
        }
        if !path.pop() {
            break;
        }
    }
    None
}

fn init_visual_source(dir: PathBuf) -> Result<(), Box<dyn std::error::Error>> {
    let path = dir.join(VISUAL_SOURCE_DIR);
    fs::create_dir(&path)?;

    // Write default specification to manifest.json
    let manifest = r#"{}"#;
    fs::write(path.join(MANIFEST_FILENAME), manifest)?;
    Ok(())
}

fn run_init() -> Result<(), Box<dyn std::error::Error>> {
    let path = find_visual_source_directory();
    if let Some(path) = path {
        if current_dir() == path {
            println!("Visual source already initialised");
            return Ok(());
        }
    }
    init_visual_source(std::env::current_dir().unwrap())
}

const VISUAL_SOURCE_DIR: &str = ".visual-source";
const MANIFEST_FILENAME: &str = "manifest.json";
const GENERATE_HOOK_FILENAME: &str = "generate";

fn run_gui() -> Result<(), Box<dyn std::error::Error>> {
    let mut dir = find_visual_source_directory();
    if dir.is_none() {
        dir = prompt_to_init_visual_source();
        if dir.is_none() {
            println!("Visual Source not initialized; see visual-source init");
            return Ok(());
        }
    }

    let state = AppState { dir: dir.unwrap() };

    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .manage(state)
        .invoke_handler(tauri::generate_handler![get, write_outputs])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}

#[derive(Debug)]
struct AppState {
    dir: PathBuf,
}

#[tauri::command]
fn get(state: tauri::State<'_, AppState>) -> String {
    let filename = state.dir.join(MANIFEST_FILENAME);
    match fs::read_to_string(filename) {
        Ok(content) => content,
        Err(err) => {
            println!("Error reading file: {:?}", err);
            "{}".to_string()
        }
    }
}

#[tauri::command]
fn write_outputs(
    manifest: String,
    css: String,
    json: String,
    agents: String,
    state: tauri::State<'_, AppState>,
) -> Result<(), String> {
    let dir = &state.dir;
    let files: [(&str, &str); 5] = [
        (MANIFEST_FILENAME, &manifest),
        ("visual-source.css", &css),
        ("visual-source.json", &json),
        ("AGENTS.md", &agents),
        ("CLAUDE.md", &agents),
    ];
    for (name, content) in &files {
        fs::write(dir.join(name), content)
            .map_err(|e| format!("failed to write {}: {}", name, e))?;
    }

    let hook = dir.join(GENERATE_HOOK_FILENAME);
    if hook.exists() {
        let start = std::time::Instant::now();
        let result = std::process::Command::new(&hook).current_dir(dir).output();
        let ms = start.elapsed().as_millis();
        match result {
            Ok(output) if output.status.success() => {
                println!("saved {} files; ./{} ok ({}ms)", files.len(), GENERATE_HOOK_FILENAME, ms);
            }
            Ok(output) => {
                let stderr = String::from_utf8_lossy(&output.stderr);
                println!(
                    "saved {} files; ./{} failed ({}): {}",
                    files.len(),
                    GENERATE_HOOK_FILENAME,
                    output.status,
                    stderr.trim()
                );
            }
            Err(e) => {
                println!(
                    "saved {} files; failed to invoke ./{}: {}",
                    files.len(),
                    GENERATE_HOOK_FILENAME,
                    e
                );
            }
        }
    } else {
        println!("saved {} files", files.len());
    }
    Ok(())
}
