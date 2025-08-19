import { commands, type Model } from "../bindings";

export class TasksService {
  static async getAllTasks(): Promise<Model[]> {
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
}