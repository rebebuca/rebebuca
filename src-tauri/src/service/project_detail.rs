use crate::connection;
use entity::project_detail::{self, ActiveModel, Model};
use sea_orm::{
    ActiveModelTrait, ColumnTrait, DatabaseConnection, DbErr, EntityTrait, QueryFilter, Set,
};

use super::project::update_project_count_db;

pub async fn get_project_detail_db(project_id: String) -> Result<Vec<Model>, DbErr> {
    let db: DatabaseConnection = connection::establish_connection().await?;
    let mut project = project_detail::Entity::find()
        .filter(project_detail::Column::ProjectId.eq(project_id))
        .all(&db)
        .await?;
    project.sort_by(|a, b| b.updated_at.cmp(&a.updated_at));
    Ok(project)
}

pub async fn get_project_detail_item_db(id: String) -> Result<Vec<Model>, DbErr> {
    let db: DatabaseConnection = connection::establish_connection().await?;
    let project = project_detail::Entity::find_by_id(id).all(&db).await?;
    Ok(project)
}

pub async fn add_project_detail_db(project_detail: Model) -> Result<Vec<Model>, DbErr> {
    let project_id = project_detail.project_id.clone();
    let project_id2 = project_detail.project_id.clone();
    let db: DatabaseConnection = connection::establish_connection().await.unwrap();
    let model = ActiveModel {
        id: Set(project_detail.id),
        project_id: Set(project_detail.project_id),
        name: Set(project_detail.name),
        url: Set(project_detail.url),
        log: Set(project_detail.log),
        arg_list: Set(project_detail.arg_list),
        pid: Set(project_detail.pid),
        status: Set(project_detail.status),
        updated_at: Set(project_detail.updated_at),
    };
    model.insert(&db).await?;
    let mut re = project_detail::Entity::find()
        .filter(project_detail::Column::ProjectId.eq(project_id))
        .all(&db)
        .await?;

    let count = re.len();

    update_project_count_db(count, project_id2).await?;
    re.sort_by(|a, b| b.updated_at.cmp(&a.updated_at));
    Ok(re)
}

pub async fn update_project_detail_db(project: Model) -> Result<Vec<Model>, DbErr> {
    let db: DatabaseConnection = connection::establish_connection().await.unwrap();
    let model = ActiveModel {
        id: Set(project.id),
        project_id: Set(project.project_id),
        name: Set(project.name),
        url: Set(project.url),
        log: Set(project.log),
        arg_list: Set(project.arg_list),
        pid: Set(project.pid),
        status: Set(project.status),
        updated_at: Set(project.updated_at),
    };
    model.update(&db).await?;
    let mut project = project_detail::Entity::find().all(&db).await?;
    project.sort_by(|a, b| b.updated_at.cmp(&a.updated_at));
    Ok(project)
}

pub async fn del_project_detail_db(id: String, project_id: String) -> Result<Vec<Model>, DbErr> {
    let project_id2 = project_id.clone();
    let db: DatabaseConnection = connection::establish_connection().await.unwrap();
    project_detail::Entity::delete_by_id(id).exec(&db).await?;

    let mut result = project_detail::Entity::find()
        .filter(project_detail::Column::ProjectId.eq(project_id))
        .all(&db)
        .await?;

    let count = result.len();

    update_project_count_db(count, project_id2).await?;

    result.sort_by(|a, b| b.updated_at.cmp(&a.updated_at));

    Ok(result)
}
