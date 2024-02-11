use crate::util;

use tauri::{AboutMetadata, CustomMenuItem, Manager, Menu, MenuItem, Submenu, WindowMenuEvent};

// --- Menu
pub fn init() -> Menu {
    let name = "Rebebuca";
    let app_menu = Submenu::new(
        name,
        Menu::new()
            .add_native_item(MenuItem::About(name.into(), AboutMetadata::default()))
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::Hide)
            .add_native_item(MenuItem::HideOthers)
            .add_native_item(MenuItem::ShowAll)
            .add_native_item(MenuItem::Separator)
            .add_item(
                CustomMenuItem::new("reload".to_string(), "Refresh the Screen")
                    .accelerator("CmdOrCtrl+R"),
            ),
    );

    let help_menu = Submenu::new(
        "帮助",
        Menu::new()
            .add_item(CustomMenuItem::new("rebebuca_log".to_string(), "运行日志"))
            .add_native_item(MenuItem::Separator)
            .add_item(CustomMenuItem::new("report_bug".to_string(), "反馈Bug"))
            .add_item(CustomMenuItem::new("document".to_string(), "官方文档"))
            .add_native_item(MenuItem::Separator)
            .add_item(
                CustomMenuItem::new("dev_tools".to_string(), "Toggle Developer Tools")
                    .accelerator("CmdOrCtrl+Shift+I"),
            ),
    );

    Menu::new().add_submenu(app_menu).add_submenu(help_menu)
}

// --- Menu Event
pub fn menu_handler(event: WindowMenuEvent<tauri::Wry>) {
    let win = Some(event.window()).unwrap();

    let app = win.app_handle();
    let menu_id = event.menu_item_id();

    match menu_id {
        "reload" => {
            win.eval("window.location.reload()").unwrap();
        }
        // Help
        "document" => {
            tauri::api::shell::open(&app.shell_scope(), "https://rebebuca.com", None).unwrap();
        }
        "rebebuca_log" => util::open_file(util::app_root().join("rebebuca.log")),
        "report_bug" => {
            tauri::api::shell::open(
                &app.shell_scope(),
                "https://github.com/rebebuca/rebebuca/issues",
                None,
            )
            .unwrap();
        }
        "dev_tools" => {
            win.open_devtools();
            win.close_devtools();
        }
        _ => (),
    }
}
