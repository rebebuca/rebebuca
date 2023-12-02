extern crate alloc;
use crate::service::project_detail::{
    add_project_detail_db, del_project_detail_db, get_project_detail_db,
    get_project_detail_item_db, update_project_detail_db,
};
use entity::project_detail::Model;

#[tauri::command]
pub async fn get_project_detail(project_id: String) -> Result<Vec<Model>, ()> {
    let res = get_project_detail_db(project_id).await;
    Ok(res.unwrap())
}

#[tauri::command]
pub async fn get_project_detail_item(id: String) -> Result<Vec<Model>, ()> {
    let res = get_project_detail_item_db(id).await;
    Ok(res.unwrap())
}

#[tauri::command]
pub async fn add_project_detail(project_detail: Model) -> Result<Vec<Model>, ()> {
    let res = add_project_detail_db(project_detail).await.unwrap();
    Ok(res)
}

#[tauri::command]
pub async fn update_project_detail(project_detail: Model) -> Result<Vec<Model>, ()> {
    let res = update_project_detail_db(project_detail).await.unwrap();
    Ok(res)
}

#[tauri::command]
pub async fn del_project_detail(id: String, project_id: String) -> Result<Vec<Model>, ()> {
    let res = del_project_detail_db(id, project_id).await.unwrap();
    Ok(res)
}
