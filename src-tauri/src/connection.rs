use crate::util;
use migration::{DbErr, Migrator, MigratorTrait};
use sea_orm::{Database, DbConn};
use std::{
    fs::{self, OpenOptions},
    path::Path,
};

pub async fn establish_connection() -> Result<DbConn, DbErr> {
    let dir = Path::new(util::get_app_dir());
    let file = dir.join("rb_prod.sqlite");
    fs::create_dir_all(dir).unwrap();
    OpenOptions::new()
        .read(true)
        .write(true)
        .create(true)
        .open(file.clone())
        .unwrap();

    let database_url = format!("sqlite://{}", file.into_os_string().into_string().unwrap());

    let db = Database::connect(&database_url)
        .await
        .expect("Failed to setup the database");
    Migrator::up(&db, None)
        .await
        .expect("Failed to run migrations for tests");

    Ok(db)
}
