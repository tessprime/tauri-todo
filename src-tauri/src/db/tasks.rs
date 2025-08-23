use sea_orm::*;
use crate::entities::{tasks, task_groups, task_group_ordering, prelude::*};
use serde::{Deserialize, Serialize};
use specta::Type;

// Type aliases for cleaner API
pub type TaskModel = tasks::Model;
pub type TaskGroupModel = task_groups::Model;

// Extended task model with ordering information
#[derive(Clone, Debug, Serialize, Deserialize, Type, FromQueryResult)]
#[specta(rename = "TaskWithOrder")]
pub struct TaskWithOrder {
    pub id: i32,
    pub text: String,
    pub create_date: String,
    pub complete_date: Option<String>,
    pub status: String,
    pub order_index: i32,
}

#[tauri::command]
#[specta::specta]
pub async fn get_tasks_by_group(group_name: String) -> Result<Vec<TaskWithOrder>, String> {
    let db = super::get_database_connection().await.map_err(|e| e.to_string())?;

    let results = Tasks::find()
        .column_as(task_group_ordering::Column::OrderIndex, "order_index")
        .join(JoinType::InnerJoin, tasks::Relation::TaskGroupOrdering.def())
        .join(JoinType::InnerJoin, task_group_ordering::Relation::TaskGroups.def())
        .filter(task_groups::Column::Name.eq(group_name))
        .order_by_asc(task_group_ordering::Column::OrderIndex)
        .order_by_asc(tasks::Column::CreateDate)
        .into_model::<TaskWithOrder>()
        .all(&db)
        .await
        .map_err(|e| e.to_string())?;
    
    Ok(results)
}

#[tauri::command]
#[specta::specta]
pub async fn get_all_tasks() -> Result<Vec<TaskWithOrder>, String> {
    get_tasks_by_group("default".to_string()).await
}

#[tauri::command]
#[specta::specta]
pub async fn get_all_task_groups() -> Result<Vec<TaskGroupModel>, String> {
    let db = super::get_database_connection().await.map_err(|e| e.to_string())?;
    
    let groups = TaskGroups::find()
        .order_by_asc(task_groups::Column::CreateDate)
        .all(&db)
        .await
        .map_err(|e| e.to_string())?;
    
    Ok(groups)
}