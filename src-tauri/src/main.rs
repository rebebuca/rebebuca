// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod command;
mod connection;
mod service;

use std::process::Command;

use command::project;
use command::project_detail;

use tauri::Manager;

#[tauri::command]
fn greet(pid: &str) {
    // format!("Hello, {}! You've been greeted from Rust!", name)
    println!("2222{}", pid);
    // let _ = Command::new("kill").arg("-9").arg(&pid).output();
    // let output = Command::new("ps").arg("-p").arg("0").output().unwrap();
    // let output_str = String::from_utf8(output.stdout).unwrap();
    // println!("4444{}", output_str);
    // println!("4444{}", output_str.contains(&pid));
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
