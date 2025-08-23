import { useState, useEffect, useRef } from "react";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";
import { type TaskModel, type TaskGroupModel } from "./bindings";
import TaskContainer from "./components/TaskContainer";
import { TasksService } from "./services/TasksService";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [taskGroups, setTaskGroups] = useState<TaskGroupModel[]>([]);
  const [selectedGroupName, setSelectedGroupName] = useState<string>("default");
  const containerRef = useRef<HTMLDivElement>(null);


  const closeApp = async () => {
    try {
      const window = getCurrentWindow();
      await window.close();
    } catch (error) {
      console.error("Failed to close window:", error);
    }
  };

  const resizeWindow = async () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;

    const rect = document.body.getBoundingClientRect();

    // Get margins
    const cs = window.getComputedStyle(document.body);
    const totalMarginsVertical = parseFloat(cs.marginTop) + parseFloat(cs.marginBottom);

    // Use scrollHeight/scrollWidth to get full content size including overflow
    //const width = Math.max(cs.maxWidth + cs.marginRight+cs.marginLeft);
    const width = Math.max(300 + 40);
    const height = Math.max(150, Math.ceil(rect.height) )
      + totalMarginsVertical;
    console.log(totalMarginsVertical)
    
    console.log(`Resizing window to: ${width}x${height}`);
    
    try {
      const window = getCurrentWindow();
      await window.setSize(new LogicalSize(width, height));
    } catch (error) {
      console.error("Failed to resize window:", error);
    }
  };

  useEffect(() => {
    const loadTaskGroups = async () => {
      try {
        const groups = await TasksService.getAllTaskGroups();
        setTaskGroups(groups);
      } catch (error) {
        console.error("Error loading task groups:", error);
      }
    };

    loadTaskGroups();
  }, []);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasks = await TasksService.getTasksByGroup(selectedGroupName);
        setTasks(tasks);
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    };

    loadTasks();
  }, [selectedGroupName]);

  useEffect(() => {
    resizeWindow();
  }, [tasks]);

  return (
    <div ref={containerRef}>
      <header className="app-header" data-tauri-drag-region>
        <h1>Todo Tauri</h1>
        <button className="close-button" onClick={closeApp}>×</button>
      </header>
      <div className="task-group-selector">
        <label htmlFor="group-select">Task Group:</label>
        <select 
          id="group-select"
          value={selectedGroupName} 
          onChange={(e) => setSelectedGroupName(e.target.value)}
        >
          {taskGroups.map(group => (
            <option key={group.id} value={group.name}>
              {group.name}
            </option>
          ))}
        </select>
      </div>
      <main className="container">
        <TaskContainer tasks={tasks} onTasksChange={setTasks} />
      </main>
    </div>
  );
}

export default App;
