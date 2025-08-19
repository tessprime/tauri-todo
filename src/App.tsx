import { useState, useEffect, useRef } from "react";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";
import { commands, type Model } from "./bindings";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState<Model[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: task.status === "completed" ? "pending" : "completed" } : task
    ));
  };

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
    const width = Math.max(300, Math.ceil(rect.width));
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
    const loadTasks = async () => {
      try {
        const result = await commands.getAllTasks();
        if (result.status === "ok") {
          setTasks(result.data);
          console.log(result.data);
        } else {
          console.error("Failed to load tasks:", result.error);
        }
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    };

    loadTasks();
  }, []);

  useEffect(() => {
    resizeWindow();
  }, [tasks]);

  return (
    <div ref={containerRef}>
      <header className="app-header" data-tauri-drag-region>
        <h1>Todo Tauri</h1>
        <button className="close-button" onClick={closeApp}>×</button>
      </header>
      <main className="container">
        <div className="task-list">
          {tasks.map(task => (
            <div key={task.id} className="task-item">
              <input
                type="checkbox"
                id={`task-${task.id}`}
                checked={task.status === "completed"}
                onChange={() => toggleTask(task.id)}
              />
              <label htmlFor={`task-${task.id}`} className={task.status === "completed" ? 'completed' : ''}>
                {task.text}
              </label>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
