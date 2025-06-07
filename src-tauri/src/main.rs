// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use clap::{Parser, Subcommand};
use std::{fs, path::PathBuf};

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
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cli = Cli::parse();
    match cli.command {
        Some(Commands::Init {}) => run_init()?,
        None => run_gui()?,
    }
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
