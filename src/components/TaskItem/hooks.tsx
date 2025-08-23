import { useState } from "react";
import { type TaskModel } from "../../bindings";

export interface TaskItemProps {
  task: TaskModel;
  isEditing: boolean;
  editText: string;
  isDragging: boolean;
  isDragOver: boolean;
  onToggle: (id: number) => void;
  onStartEdit: (id: number, text: string) => void;
  onSaveEdit: (id: number) => void;
  onCancelEdit: () => void;
  onEditTextChange: (text: string) => void;
  onDragStart: (e: React.DragEvent, taskId: number) => void;
  onDragOver: (e: React.DragEvent, taskId: number) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, taskId: number) => void;
  onDragEnd: () => void;
}

export interface TaskContainerProps {
  tasks: TaskModel[];
  onTasksChange: (tasks: TaskModel[]) => void;
}

export function useTaskToggle(tasks: TaskModel[], onTasksChange: (tasks: TaskModel[]) => void) {
  const toggleTask = (id: number) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, status: task.status === "completed" ? "pending" : "completed" } : task
    );
    onTasksChange(updatedTasks);
  };

  return { toggleTask };
}

export function useTaskEdit(tasks: TaskModel[], onTasksChange: (tasks: TaskModel[]) => void) {
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");

  const startEdit = (id: number, currentText: string) => {
    setEditingTaskId(id);
    setEditText(currentText);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditText("");
  };

  const saveEdit = (id: number) => {
    if (editText.trim()) {
      const updatedTasks = tasks.map(task => 
        task.id === id ? { ...task, text: editText.trim() } : task
      );
      onTasksChange(updatedTasks);
    }
    setEditingTaskId(null);
    setEditText("");
  };

  return {
    editingTaskId,
    editText,
    startEdit,
    cancelEdit,
    saveEdit,
    setEditText
  };
}