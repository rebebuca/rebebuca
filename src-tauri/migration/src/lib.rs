pub use sea_orm_migration::prelude::*;

mod m20220101_000001_create_app_setting;
mod m20220101_000001_create_project;
mod m20220101_000001_create_project_detail;
mod m20220101_000002_app_setting_ai;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_create_project::Migration),
            Box::new(m20220101_000001_create_project_detail::Migration),
            Box::new(m20220101_000001_create_app_setting::Migration),
            Box::new(m20220101_000002_app_setting_ai::Migration),
        ]
    }
}
