// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
use std::{env::args, fs, sync::Mutex};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let state = AppState {
        filename: Mutex::new(None),
    };

    let args: Vec<String> = args().collect();
    if args.len() > 2 {
        panic!("Expected as most 1 argument");
    } else if args.len() == 2 {
        *state.filename.lock().unwrap() = Some(args[1].clone());
    }

    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .manage(state)
        .invoke_handler(tauri::generate_handler![filename, set_filename, get, save])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}

#[derive(Debug)]
struct AppState {
    filename: Mutex<Option<String>>,
}

#[tauri::command]
fn filename(state: tauri::State<'_, AppState>) -> String {
    let filename = state.filename.lock().unwrap();
    if let Some(filename) = &*filename {
        filename.clone()
    } else {
        "".to_string()
    }
}

#[tauri::command]
fn set_filename(new_filename: String, state: tauri::State<'_, AppState>) {
    let mut filename = state.filename.lock().unwrap();
    *filename = Some(new_filename);
}

#[tauri::command]
fn get(state: tauri::State<'_, AppState>) -> String {
    let filename = state.filename.lock().unwrap();
    match &*filename {
        Some(filename) => match fs::read_to_string(filename) {
            Ok(content) => content,
            Err(_) => "".to_string(),
        },
        None => "".to_string(),
    }
}

#[tauri::command]
fn save(data: String, state: tauri::State<'_, AppState>) {
    let filename = state.filename.lock().unwrap();
    match &*filename {
        Some(filename) => match fs::write(filename, data) {
            Ok(_) => (),
            Err(e) => println!("Error saving: {}", e),
        },
        _ => {}
    }
}
