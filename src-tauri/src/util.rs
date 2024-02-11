use log::info;
use std::{path::PathBuf, process::Command};

use once_cell::sync::OnceCell;

static APP_DIR: OnceCell<String> = OnceCell::new();

pub fn set_app_dir(dir: String) {
    APP_DIR.set(dir).unwrap();
}

pub fn get_app_dir() -> &'static String {
    APP_DIR.get().unwrap()
}

pub fn app_root() -> PathBuf {
    tauri::api::path::home_dir().unwrap().join(".rebebuca")
}

pub fn convert_path(path_str: &str) -> String {
    if cfg!(target_os = "windows") {
        path_str.replace('/', "\\")
    } else {
        String::from(path_str)
    }
}

pub fn open_file(path: PathBuf) {
    let pathname = convert_path(path.to_str().unwrap());
    info!("open_file: {}", pathname);
    #[cfg(target_os = "macos")]
    Command::new("open")
        .arg("-R")
        .arg(pathname)
        .spawn()
        .unwrap();

    #[cfg(target_os = "windows")]
    Command::new("explorer.exe")
        .arg("/select,")
        .arg(pathname)
        .spawn()
        .unwrap();

    #[cfg(target_os = "linux")]
    Command::new("xdg-open").arg(pathname).spawn().unwrap();
}
