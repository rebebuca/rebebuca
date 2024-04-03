use sea_orm_migration::prelude::*;

#[derive(DeriveIden)]
enum Version {
    Table,
    Id,
    Version,
    CreatedAt,
    UpdatedAt,
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
                    .table(Version::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Version::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Version::Version).string().not_null())
                    .col(ColumnDef::new(Version::CreatedAt).integer().not_null())
                    .col(ColumnDef::new(Version::UpdatedAt).string().not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        // todo!();

        manager
            .drop_table(Table::drop().table(Version::Table).to_owned())
            .await
    }
}
