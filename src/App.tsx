import { useState, useEffect, useRef } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Task A", completed: false },
    { id: 2, text: "Task B", completed: false },
    { id: 3, text: "Task C", completed: false }
  ]);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const resizeWindow = async () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Add some padding to the dimensions
    const width = Math.max(300, Math.ceil(rect.width) + 40);
    const height = Math.max(150, Math.ceil(rect.height) + 40);
    
    try {
      const window = getCurrentWindow();
      await window.setSize({ width, height });
    } catch (error) {
      console.error("Failed to resize window:", error);
    }
  };

  useEffect(() => {
    // Delay to ensure DOM is rendered
    const timer = setTimeout(resizeWindow, 100);
    return () => clearTimeout(timer);
  }, [tasks]);

  return (
    <div ref={containerRef}>
      <header className="app-header">
        <h1>Todo Tauri</h1>
      </header>
      <main className="container">
        <div className="task-list">
          {tasks.map(task => (
            <div key={task.id} className="task-item">
              <input
                type="checkbox"
                id={`task-${task.id}`}
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              <label htmlFor={`task-${task.id}`} className={task.completed ? 'completed' : ''}>
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
