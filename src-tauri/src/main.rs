// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
use std::{env::args, fs};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args: Vec<String> = args().collect();
    if args.len() != 2 {
        panic!("Expected 1 argument, got {}", args.len() - 1);
    }

    let state = AppState {
        filename: args[1].clone(),
    };

    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![get, save])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}

#[derive(Debug)]
struct AppState {
    filename: String,
}

#[tauri::command]
fn get(state: tauri::State<'_, AppState>) -> String {
    match fs::read_to_string(&state.filename) {
        Ok(content) => content,
        Err(_) => "".to_string(),
    }
}

#[tauri::command]
fn save(data: String, state: tauri::State<'_, AppState>) {
    match fs::write(&state.filename, data) {
        Ok(_) => (),
        Err(e) => println!("Error saving: {}", e),
    }
}
