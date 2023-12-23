use sea_orm_migration::prelude::*;

#[derive(DeriveIden)]
enum AppSetting {
    Table,
    Version,
    Ffmpeg,
    Theme,
    Lang
}

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        // todo!();

        manager
            .create_table(
                Table::create()
                    .table(AppSetting::Table)
                    .if_not_exists()
                    .col(ColumnDef::new(AppSetting::Version).string().not_null().primary_key())
                    .col(ColumnDef::new(AppSetting::Ffmpeg).string().not_null())
                    .col(ColumnDef::new(AppSetting::Theme).string().not_null())
                    .col(ColumnDef::new(AppSetting::Lang).string().not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        // todo!();

        manager
            .drop_table(Table::drop().table(AppSetting::Table).to_owned())
            .await
    }
}
