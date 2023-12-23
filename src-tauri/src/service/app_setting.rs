use crate::connection;
use entity::app_setting::{self, ActiveModel, Model};
use sea_orm::{ActiveModelTrait, DatabaseConnection, DbErr, EntityTrait, Set};

pub async fn get_app_setting_db() -> Result<Vec<Model>, DbErr> {
    let db: DatabaseConnection = connection::establish_connection().await?;
    let app_setting = app_setting::Entity::find().all(&db).await?;
    Ok(app_setting)
}

pub async fn add_app_setting_db(app_setting: Model) -> Result<Vec<Model>, DbErr> {
    let db: DatabaseConnection = connection::establish_connection().await.unwrap();
    let model = ActiveModel {
        version: Set(app_setting.version),
        ffmpeg: Set(app_setting.ffmpeg),
        theme: Set(app_setting.theme),
        lang: Set(app_setting.lang),
    };
    model.insert(&db).await?;
    let app_setting = app_setting::Entity::find().all(&db).await?;
    Ok(app_setting)
}

pub async fn update_app_setting_db(app_setting: Model) -> Result<Vec<Model>, DbErr> {
    let db: DatabaseConnection = connection::establish_connection().await.unwrap();
    let model = ActiveModel {
        version: Set(app_setting.version),
        ffmpeg: Set(app_setting.ffmpeg),
        theme: Set(app_setting.theme),
        lang: Set(app_setting.lang),
    };
    model.update(&db).await?;
    let app_setting = app_setting::Entity::find().all(&db).await?;
    Ok(app_setting)
}
