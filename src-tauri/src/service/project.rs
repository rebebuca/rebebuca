use crate::connection;
use entity::project::{self, ActiveModel, Model};
use sea_orm::{ActiveModelTrait, DatabaseConnection, DbErr, EntityTrait, Set};

pub async fn get_project_db() -> Result<Vec<Model>, DbErr> {
    let db: DatabaseConnection = connection::establish_connection().await?;
    let mut project = project::Entity::find().all(&db).await?;
    project.sort_by(|a, b| b.updated_at.cmp(&a.updated_at));
    Ok(project)
}

pub async fn add_project_db(project: Model) -> Result<Vec<Model>, DbErr> {
    let db: DatabaseConnection = connection::establish_connection().await.unwrap();
    let model = ActiveModel {
        project_id: Set(project.project_id),
        name: Set(project.name),
        desc: Set(project.desc),
        count: Set(project.count),
        updated_at: Set(project.updated_at),
    };
    model.insert(&db).await?;
    let mut project = project::Entity::find().all(&db).await?;
    project.sort_by(|a, b| b.updated_at.cmp(&a.updated_at));
    Ok(project)
}

pub async fn update_project_db(project: Model) -> Result<Vec<Model>, DbErr> {
    let db: DatabaseConnection = connection::establish_connection().await.unwrap();
    let model = ActiveModel {
        project_id: Set(project.project_id),
        name: Set(project.name),
        desc: Set(project.desc),
        count: Set(project.count),
        updated_at: Set(project.updated_at),
    };
    model.update(&db).await?;
    let mut project = project::Entity::find().all(&db).await?;
    project.sort_by(|a, b| b.updated_at.cmp(&a.updated_at));
    Ok(project)
}

pub async fn update_project_count_db(count: usize, project_id: String) -> Result<(), DbErr> {
    let id = project_id.clone();
    let db: DatabaseConnection = connection::establish_connection().await.unwrap();
    let data = project::Entity::find_by_id(project_id).one(&db).await?;
    let data = data.unwrap();
    let model = ActiveModel {
        project_id: Set(id),
        name: Set(data.name),
        desc: Set(data.desc),
        count: Set(count.try_into().unwrap()),
        updated_at: Set(data.updated_at),
    };
    model.update(&db).await?;
    Ok(())
}

pub async fn del_project_db(id: String) -> Result<Vec<Model>, DbErr> {
    let db: DatabaseConnection = connection::establish_connection().await.unwrap();
    project::Entity::delete_by_id(id).exec(&db).await?;
    let mut result = project::Entity::find().all(&db).await?;
    result.sort_by(|a, b| b.updated_at.cmp(&a.updated_at));
    Ok(result)
}
