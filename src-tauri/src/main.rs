// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use clap::{Parser, Subcommand};
use std::{fs, path::PathBuf, sync::Mutex};

#[derive(Parser)]
#[command(
    author,
    about,
    long_about = "Launch the Visual Source GUI.

If you haven't done yet, run `visual-source init` to initialize Visual Source"
)]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,

    dir: Option<PathBuf>,
}

#[derive(Subcommand)]
enum Commands {
    #[command(author, about = "Initializes Visual Source in the current directory")]
    Init {},
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cli = Cli::parse();
    match cli.command {
        Some(Commands::Init {}) => run_init()?,
        None => run_gui(cli.dir)?,
    }
    Ok(())
}

fn find_visual_source_directory(root_dir: Option<PathBuf>) -> Option<PathBuf> {
    let mut path = root_dir.unwrap_or_else(|| match std::env::var("VISUAL_SOURCE_ROOT") {
        Ok(root) => PathBuf::from(root),
        Err(_) => std::env::current_dir().unwrap(),
    });
    loop {
        if path.join(VISUAL_SOURCE_DIR).exists() {
            return Some(path.join(VISUAL_SOURCE_DIR));
        }
        if !path.pop() {
            return None;
        }
    }
}

fn run_init() -> Result<(), Box<dyn std::error::Error>> {
    let path = find_visual_source_directory(Option::None);
    if let Some(path) = path {
        if std::env::current_dir().unwrap() == path {
            println!("Visual source already initialised");
            return Ok(());
        }
    }
    // Create .visual-source directory
    let path = std::env::current_dir().unwrap().join(VISUAL_SOURCE_DIR);
    fs::create_dir(&path)?;

    // Write default specification to manifest.json
    let manifest = r#"{}"#;
    fs::write(path.join(MANIFEST_FILENAME), manifest)?;
    Ok(())
}

const VISUAL_SOURCE_DIR: &str = ".visual-source";
const MANIFEST_FILENAME: &str = "manifest.json";

fn run_gui(root_dir: Option<PathBuf>) -> Result<(), Box<dyn std::error::Error>> {
    let dir = find_visual_source_directory(root_dir);
    if dir.is_none() {
        println!("Visual Source must be initialized; please run 'visual-source init'");
        return Ok(());
    }

    let state = AppState { dir: dir.unwrap() };

    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .manage(state)
        .invoke_handler(tauri::generate_handler![get, write])
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
fn write(filename: String, data: String, state: tauri::State<'_, AppState>) {
    let filename = state.dir.join(filename);
    println!("Saving data to {:?}", filename.to_str());
    match fs::write(filename, data) {
        Ok(_) => (),
        Err(e) => println!("Error saving: {}", e),
    }
}
