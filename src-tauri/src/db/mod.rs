pub mod tasks;

use sea_orm::*;

pub async fn get_database_connection() -> Result<DatabaseConnection, DbErr> {
    let database_url = "sqlite:migration/tasks.db";
    Database::connect(database_url).await
}