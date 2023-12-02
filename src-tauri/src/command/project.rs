extern crate alloc;
use crate::service::project::{add_project_db, del_project_db, get_project_db, update_project_db};
use entity::project::Model;

#[tauri::command]
pub async fn get_project() -> Result<Vec<Model>, ()> {
    let res = get_project_db().await;
    Ok(res.unwrap())
}

#[tauri::command]
pub async fn add_project(project: Model) -> Result<Vec<Model>, ()> {
    let res = add_project_db(project).await.unwrap();
    Ok(res)
}

#[tauri::command]
pub async fn update_project(project: Model) -> Result<Vec<Model>, ()> {
    let res = update_project_db(project).await.unwrap();
    Ok(res)
}

#[tauri::command]
pub async fn del_project(project_id: String) -> Result<Vec<Model>, ()> {
    let res = del_project_db(project_id).await.unwrap();
    Ok(res)
}
