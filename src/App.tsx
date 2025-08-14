import { useState, useEffect, useRef } from "react";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Task A", completed: false },
    { id: 2, text: "Task B", completed: false },
    { id: 3, text: "Task C", completed: false },
    { id: 4, text: "Task D", completed: false }
  ]);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
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
    resizeWindow();
  }, [tasks]);

  return (
    <div ref={containerRef}>
      <header className="app-header">
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
