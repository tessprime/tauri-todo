use sea_orm_migration::{prelude::*, schema::*};

use super::m20250814_234039_create_tasks_table::Tasks;
use super::m20250819_205817_create_task_groups_table::TaskGroups;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(TaskGroupOrdering::Table)
                    .if_not_exists()
                    .col(pk_auto(TaskGroupOrdering::Id))
                    .col(integer(TaskGroupOrdering::TaskId))
                    .col(integer(TaskGroupOrdering::TaskGroupId))
                    .col(integer(TaskGroupOrdering::OrderIndex))
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_task_group_ordering_task_id")
                            .from(TaskGroupOrdering::Table, TaskGroupOrdering::TaskId)
                            .to(Tasks::Table, Tasks::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_task_group_ordering_task_group_id")
                            .from(TaskGroupOrdering::Table, TaskGroupOrdering::TaskGroupId)
                            .to(TaskGroups::Table, TaskGroups::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                    )
                    .index(
                        Index::create()
                            .name("idx_task_group_ordering_unique")
                            .table(TaskGroupOrdering::Table)
                            .col(TaskGroupOrdering::TaskId)
                            .col(TaskGroupOrdering::TaskGroupId)
                            .unique()
                    )
                    .to_owned(),
            )
            .await?;

        // Insert sample "hello world" task
        let insert_task = Query::insert()
            .into_table(Tasks::Table)
            .columns([Tasks::Text, Tasks::CreateDate, Tasks::Status])
            .values_panic([
                "Hello World".into(),
                chrono::Utc::now().to_rfc3339().into(),
                "pending".into()
            ])
            .to_owned();

        manager.exec_stmt(insert_task).await?;
        
        let insert_task = Query::insert()
            .into_table(Tasks::Table)
            .columns([Tasks::Text, Tasks::CreateDate, Tasks::Status])
            .values_panic([
                "Hello World 2".into(),
                chrono::Utc::now().to_rfc3339().into(),
                "pending".into()
            ])
            .to_owned();

        manager.exec_stmt(insert_task).await?;

        // Add the task to the default group (assuming default group has ID 1)
        let insert_ordering = Query::insert()
            .into_table(TaskGroupOrdering::Table)
            .columns([TaskGroupOrdering::TaskId, TaskGroupOrdering::TaskGroupId, TaskGroupOrdering::OrderIndex])
            .values_panic([1.into(), 1.into(), 0.into()])
            .to_owned();
        

        manager.exec_stmt(insert_ordering).await?;

        let insert_ordering = Query::insert()
            .into_table(TaskGroupOrdering::Table)
            .columns([TaskGroupOrdering::TaskId, TaskGroupOrdering::TaskGroupId, TaskGroupOrdering::OrderIndex])
            .values_panic([2.into(), 1.into(), 1.into()])
            .to_owned();

        manager.exec_stmt(insert_ordering).await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(TaskGroupOrdering::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum TaskGroupOrdering {
    Table,
    Id,
    TaskId,
    TaskGroupId,
    OrderIndex,
}
