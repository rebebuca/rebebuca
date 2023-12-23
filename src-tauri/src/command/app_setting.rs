extern crate alloc;
use crate::service::app_setting::{add_app_setting_db, get_app_setting_db, update_app_setting_db};
use entity::app_setting::Model;

#[tauri::command]
pub async fn get_app_setting() -> Result<Vec<Model>, ()> {
    let res = get_app_setting_db().await;
    Ok(res.unwrap())
}

#[tauri::command]
pub async fn add_app_setting(app_setting: Model) -> Result<Vec<Model>, ()> {
    let res = add_app_setting_db(app_setting).await.unwrap();
    Ok(res)
}

#[tauri::command]
pub async fn update_app_setting(app_setting: Model) -> Result<Vec<Model>, ()> {
    let res = update_app_setting_db(app_setting).await.unwrap();
    Ok(res)
}
