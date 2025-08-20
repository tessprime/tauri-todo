use sea_orm_migration::{prelude::*, schema::*};
use chrono::Utc;

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
            .await?;

        // Insert default group
        let insert = Query::insert()
            .into_table(TaskGroups::Table)
            .columns([TaskGroups::Name, TaskGroups::CreateDate])
            .values_panic(["default".into(), chrono::Utc::now().to_rfc3339().into()])
            .to_owned();

        manager.exec_stmt(insert).await?;

        Ok(())
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
