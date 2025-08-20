use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(TaskGroups::Table)
                    .if_not_exists()
                    .col(pk_auto(TaskGroups::Id))
                    .col(string(TaskGroups::Name))
                    .col(timestamp_with_time_zone(TaskGroups::CreateDate))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(TaskGroups::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum TaskGroups {
    Table,
    Id,
    Name,
    CreateDate,
}
