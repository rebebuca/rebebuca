use sea_orm_migration::prelude::*;

#[derive(DeriveIden)]
pub enum AppSetting {
    Table,
    Version,
    Ffmpeg,
    Theme,
    QuitType,
    // Ai,
    Lang,
}

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(AppSetting::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(AppSetting::Version)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(AppSetting::Ffmpeg).string().not_null())
                    // .col(ColumnDef::new(AppSetting::Ai).string().not_null())
                    .col(ColumnDef::new(AppSetting::Theme).string().not_null())
                    .col(ColumnDef::new(AppSetting::QuitType).string().not_null())
                    .col(ColumnDef::new(AppSetting::Lang).string().not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(AppSetting::Table).to_owned())
            .await
    }
}
