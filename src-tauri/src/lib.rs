mod entities;

use sea_orm::*;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;
    use entities::{tasks, prelude::*};
    use sea_orm::*;
    use chrono::Utc;

    #[tokio::test]
    async fn test_insert_and_retrieve_task() -> Result<(), DbErr> {
        // Create in-memory SQLite database for testing
        let db = Database::connect("sqlite::memory:").await?;

        // Create the tasks table
        let schema = sea_orm::Schema::new(DatabaseBackend::Sqlite);
        let stmt = schema.create_table_from_entity(Tasks);
        db.execute(db.get_database_backend().build(&stmt)).await?;

        // Insert a sample task
        let task = tasks::ActiveModel {
            text: Set("Sample task".to_string()),
            create_date: Set(Utc::now().into()),
            complete_date: Set(None),
            status: Set("pending".to_string()),
            ..Default::default()
        };

        let inserted_task = Tasks::insert(task).exec(&db).await?;
        let task_id = inserted_task.last_insert_id;

        // Retrieve the task
        let retrieved_task = Tasks::find_by_id(task_id).one(&db).await?;

        // Verify the task was inserted and retrieved correctly
        assert!(retrieved_task.is_some());
        let task = retrieved_task.unwrap();
        assert_eq!(task.text, "Sample task");
        assert_eq!(task.status, "pending");
        assert!(task.complete_date.is_none());

        Ok(())
    }
}