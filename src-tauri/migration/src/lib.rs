pub use sea_orm_migration::prelude::*;

mod m20250814_234039_create_tasks_table;
mod m20250819_205817_create_task_groups_table;
mod m20250819_205822_create_task_group_ordering_table;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20250814_234039_create_tasks_table::Migration),
            Box::new(m20250819_205817_create_task_groups_table::Migration),
            Box::new(m20250819_205822_create_task_group_ordering_table::Migration),
        ]
    }
}
