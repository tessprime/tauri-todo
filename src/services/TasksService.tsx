import { commands, type TaskModel, type TaskGroupModel } from "../bindings";

export class TasksService {
  static async getAllTasks(): Promise<TaskModel[]> {
    try {
      const result = await commands.getAllTasks();
      if (result.status === "ok") {
        console.log(result.data);
        return result.data;
      } else {
        console.error("Failed to load tasks:", result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
      throw error;
    }
  }

  static async getAllTaskGroups(): Promise<TaskGroupModel[]> {
    try {
      const result = await commands.getAllTaskGroups();
      if (result.status === "ok") {
        return result.data;
      } else {
        console.error("Failed to load task groups:", result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error loading task groups:", error);
      throw error;
    }
  }

  static async getTasksByGroup(groupName: string): Promise<TaskModel[]> {
    try {
      const result = await commands.getTasksByGroup(groupName);
      if (result.status === "ok") {
        return result.data;
      } else {
        console.error("Failed to load tasks by group:", result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error loading tasks by group:", error);
      throw error;
    }
  }
}