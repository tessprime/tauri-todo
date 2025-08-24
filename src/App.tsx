import { useState, useEffect, useRef } from "react";
import { getCurrentWindow, LogicalSize } from "@tauri-apps/api/window";
import { type TaskModel, type TaskGroupModel } from "./bindings";
import TaskContainer from "./components/TaskContainer";
import { TasksService } from "./services/TasksService";
import { commands } from "./bindings.ts"
import "./App.css";

import React from "react";

function Demo() {
  const [dragging, setDragging] = React.useState(false);

  return (
    <div style={{ display: "flex", gap: 24 }}>
      {/* DRAG SOURCE */}
      <div
        draggable
        onDragStart={(e) => {
          console.log("hey")
          e.dataTransfer.setData("text/plain", "42"); // required in Safari
          e.dataTransfer.effectAllowed = "move";
          setDragging(true);
        }}
        onDragEnd={() => {console.log("doom");setDragging(false)}}
        style={{ width: 120, height: 120, border: "2px solid #999", display: "grid", placeItems: "center" }}
      >
        Drag me
      </div>

      {/* DROP TARGET (separate element) */}
      <div
        onDragEnter={(e) => { e.preventDefault(); console.log("enter")}}
        onDragOver={(e) => { e.preventDefault(); console.log("over"); }}
        onDrop={(e) => { e.preventDefault(); console.log("drop", e.dataTransfer.getData("text/plain")); }}
        style={{ width: 200, height: 200, border: "2px dashed #c00", display: "grid", placeItems: "center" }}
      >
        Target
      </div>
    </div>
  );
}


function App() {
  const [tasks, setTasks2] = useState<TaskModel[]>([]);
  const [taskGroups, setTaskGroups] = useState<TaskGroupModel[]>([]);
  const [selectedGroupName, setSelectedGroupName] = useState<string>("default");
  const containerRef = useRef<HTMLDivElement>(null);

  const setTasks = (array : TaskModel[] ) => {
    console.log(array);
    setTasks2(array);
  }

  const closeApp = async () => {
    try {
      const window = getCurrentWindow();
      await window.close();
    } catch (error) {
      console.error("Failed to close window:", error);
    }
  };

  (window as any).commands = commands;

  const resizeWindow = async () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;

    const rect = document.body.getBoundingClientRect();

    // Get margins
    const cs = window.getComputedStyle(document.body);
    const totalMarginsVertical = parseFloat(cs.marginTop) + parseFloat(cs.marginBottom);

    // Use scrollHeight/scrollWidth to get full content size including overflow
    //const width = Math.max( cs.maxWidth + cs.marginRight+cs.marginLeft);
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
        <Demo></Demo>
      </main>
    </div>
  );
}

export default App;
