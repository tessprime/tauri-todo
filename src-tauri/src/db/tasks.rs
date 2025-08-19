use sea_orm::*;
use crate::entities::{tasks, prelude::*};

#[tauri::command]
#[specta::specta]
pub async fn get_all_tasks() -> Result<Vec<tasks::Model>, String> {
    let db = super::get_database_connection().await.map_err(|e| e.to_string())?;
    
    let tasks = Tasks::find()
        .order_by_asc(tasks::Column::CreateDate)
        .all(&db)
        .await
        .map_err(|e| e.to_string())?;
    
    Ok(tasks)
}