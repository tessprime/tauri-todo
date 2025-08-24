import { useState } from "react";
import { type TaskModel } from "../../bindings";

export function useTaskDrag(tasks: TaskModel[], onTasksChange: (tasks: TaskModel[]) => void) {
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const [dragOverTaskId, setDragOverTaskId2] = useState<number | null>(null);

  const setDragOverTaskId = (n: number) => { console.log(n); setDragOverTaskId2(n)};

  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    console.log("yolo");
    setDraggedTaskId(taskId);
    e.dataTransfer.setData("text/plain", "something"); // must set *some* data
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, taskId: number) => {
    console.log("hey");
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTaskId(taskId);
  };

  const handleDragEnter = (e: React.DragEvent, taskId: number) => {
    console.log("hello");
    e.preventDefault();
  }

  const handleDragLeave = () => {
    setDragOverTaskId(null);
  };

  const handleDrop = (e: React.DragEvent, targetTaskId: number) => {
        console.log("hi")
    e.preventDefault();
    
    if (draggedTaskId === null || draggedTaskId === targetTaskId) {
      setDraggedTaskId(null);
      setDragOverTaskId(null);
      return;
    }

    const newTasks = [...tasks];
    const draggedIndex = newTasks.findIndex(task => task.id === draggedTaskId);
    const targetIndex = newTasks.findIndex(task => task.id === targetTaskId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [draggedTask] = newTasks.splice(draggedIndex, 1);
      newTasks.splice(targetIndex, 0, draggedTask);
      onTasksChange(newTasks);
    }
    
    setDraggedTaskId(null);
    setDragOverTaskId(null);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverTaskId(null);
  };

  return {
    draggedTaskId,
    dragOverTaskId,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDragEnter,
    handleDrop,
    handleDragEnd
  };
}