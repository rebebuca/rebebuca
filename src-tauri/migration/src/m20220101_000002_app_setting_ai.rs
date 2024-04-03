use crate::m20220101_000001_create_app_setting::AppSetting;

use sea_orm_migration::prelude::*;
#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                sea_query::Table::alter()
                    .table(AppSetting::Table)
                    .add_column(&mut ColumnDef::new(Alias::new("ai")).string().default(
                        "{\"type\":\"2\",\"key\":\"sk-f5b754a7d80849fa91aa02e3c9eba6174b\"}",
                    ))
                    .to_owned(),
            )
            .await?;
        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(AppSetting::Table).to_owned())
            .await
    }
}
