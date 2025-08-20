use sea_orm::*;
use crate::entities::{tasks, task_groups, task_group_ordering, prelude::*};
use chrono::Utc;

#[tauri::command]
#[specta::specta]
pub async fn get_tasks_by_group(group_name: String) -> Result<Vec<tasks::Model>, String> {
    let db = super::get_database_connection().await.map_err(|e| e.to_string())?;
    
    let tasks = Tasks::find()
        .join(JoinType::InnerJoin, tasks::Relation::TaskGroupOrdering.def())
        .join(JoinType::InnerJoin, task_group_ordering::Relation::TaskGroups.def())
        .filter(task_groups::Column::Name.eq(group_name))
        .order_by_asc(task_group_ordering::Column::OrderIndex)
        .order_by_asc(tasks::Column::CreateDate)
        .all(&db)
        .await
        .map_err(|e| e.to_string())?;
    
    Ok(tasks)
}

#[tauri::command]
#[specta::specta]
pub async fn get_all_tasks() -> Result<Vec<tasks::Model>, String> {
    get_tasks_by_group("default".to_string()).await
}