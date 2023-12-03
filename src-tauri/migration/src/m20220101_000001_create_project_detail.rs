use sea_orm_migration::prelude::*;

#[derive(DeriveIden)]
enum ProjectDetail {
    Table,
    Id,
    ProjectId,
    Name,
    Url,
    Status,
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
                    .table(ProjectDetail::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(ProjectDetail::Id)
                            .string()
                            .not_null()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(ProjectDetail::ProjectId).string().not_null())
                    .col(ColumnDef::new(ProjectDetail::Name).string().not_null())
                    .col(ColumnDef::new(ProjectDetail::Url).string().not_null())
                    .col(ColumnDef::new(ProjectDetail::Status).string().not_null())
                    .col(ColumnDef::new(ProjectDetail::UpdatedAt).string().not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        // todo!();

        manager
            .drop_table(Table::drop().table(ProjectDetail::Table).to_owned())
            .await
    }
}
