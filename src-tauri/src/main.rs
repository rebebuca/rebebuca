// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod command;
mod connection;
mod service;

use command::app_setting;
use command::project;
use command::project_detail;
mod util;

use tauri::Manager;

fn main() {
    let _ = fix_path_env::fix();
    tauri::Builder::default()
        .setup(|app| {
            let dir = app.path_resolver().app_data_dir().unwrap();
            util::set_app_dir(dir.to_str().unwrap().to_string());
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
                // window.close_devtools();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            app_setting::get_app_setting,
            app_setting::update_app_setting,
            app_setting::add_app_setting,
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
