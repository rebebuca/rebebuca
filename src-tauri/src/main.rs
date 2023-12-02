// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod command;
mod connection;
mod service;

use command::project;
use command::project_detail;

use tauri::Manager;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
                // window.close_devtools();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            project::get_project,
            project::add_project,
            project::del_project,
            project::update_project,
            project_detail::get_project_detail,
            project_detail::add_project_detail,
            project_detail::del_project_detail,
            project_detail::update_project_detail,
            project_detail::get_project_detail_item,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
