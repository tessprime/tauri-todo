import { useState } from "react";
import { type TaskModel } from "../../bindings";
import TaskItem from "../TaskItem";
import { useTaskToggle, useTaskEdit, type TaskContainerProps } from "../TaskItem/hooks";
import { useTaskDrag } from "./hooks";

export default function TaskContainer({ tasks, onTasksChange }: TaskContainerProps) {
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [newTaskText, setNewTaskText] = useState<string>("");

  const { toggleTask } = useTaskToggle(tasks, onTasksChange);
  const { editingTaskId, editText, startEdit, cancelEdit, saveEdit, setEditText } = useTaskEdit(tasks, onTasksChange);
  const { draggedTaskId, 
    dragOverTaskId,
    handleDragEnter,
    handleDragStart, 
    handleDragOver,
    handleDragLeave, 
    handleDrop, 
    handleDragEnd } = useTaskDrag(tasks, onTasksChange);

  const startCreateNew = () => {
    setIsCreatingNew(true);
    setNewTaskText("");
  };

  const cancelCreateNew = () => {
    setIsCreatingNew(false);
    setNewTaskText("");
  };

  const saveNewTask = () => {
    if (newTaskText.trim()) {
      const newTask: TaskModel = {
        id: Math.max(...tasks.map(t => t.id), 0) + 1,
        text: newTaskText.trim(),
        status: "pending",
        create_date: new Date().toISOString(),
        complete_date: null
      };
      onTasksChange([...tasks, newTask]);
    }
    setIsCreatingNew(false);
    setNewTaskText("");
  };

  const handleNewTaskKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveNewTask();
    } else if (e.key === 'Escape') {
      cancelCreateNew();
    }
  };


  return (
    <div className="task-list">
      {isCreatingNew && (
        <div className="task-item new-task">
          <div className="new-task-placeholder"></div>
          <div className="edit-container">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={handleNewTaskKeyPress}
              className="edit-input"
              placeholder="Enter new task..."
              autoFocus
            />
            <button onClick={saveNewTask} className="save-button">✓</button>
            <button onClick={cancelCreateNew} className="cancel-button">✕</button>
          </div>
        </div>
      )}
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          isEditing={editingTaskId === task.id}
          editText={editText}
          isDragging={draggedTaskId === task.id}
          isDragOver={dragOverTaskId === task.id}
          onToggle={toggleTask}
          onStartEdit={startEdit}
          onSaveEdit={saveEdit}
          onCancelEdit={cancelEdit}
          onEditTextChange={setEditText}
          onDragStart={handleDragStart}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
        />
      ))}
      {!isCreatingNew && (
        <button onClick={startCreateNew} className="add-task-button">
          + Add New Task
        </button>
      )}
    </div>
  );
}