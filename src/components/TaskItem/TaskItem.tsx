import { useState } from "react";
import { type Model } from "../../bindings";
import { type TaskItemProps } from "./hooks";
import TaskDragTarget from "./TaskDragTarget";
import "./TaskItem.css";

export default function TaskItem({
  task,
  isEditing,
  editText,
  isDragging,
  isDragOver,
  onToggle,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditTextChange,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}: TaskItemProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSaveEdit(task.id);
    } else if (e.key === 'Escape') {
      onCancelEdit();
    }
  };
  console.log("blotrg", onDragOver)
  return (
    <div>
      <TaskDragTarget
        targetId={task.id}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDrop={(e) => {console.log("hi");onDrop(e, task.id)}}
      />
    <div 
      className={`task-item ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragLeave={onDragLeave}
      onDragEnd={(e) => { console.log("doom"); onDragEnd()}
      }
    >
      <input
        type="checkbox"
        id={`task-${task.id}`}
        checked={task.status === "completed"}
        onChange={() => onToggle(task.id)}
      />
      <div className="drag-handle">⋮⋮</div>
      {isEditing ? (
        <div className="edit-container">
          <input
            type="text"
            value={editText}
            onChange={(e) => onEditTextChange(e.target.value)}
            onKeyDown={handleKeyPress}
            className="edit-input"
            autoFocus
          />
          <button onClick={() => onSaveEdit(task.id)} className="save-button">✓</button>
          <button onClick={onCancelEdit} className="cancel-button">✕</button>
        </div>
      ) : (
        <div className="task-content">
          <label htmlFor={`task-${task.id}`} className={task.status === "completed" ? 'completed' : ''}>
            {task.text}
          </label>
          <button onClick={() => onStartEdit(task.id, task.text)} className="edit-button">✏️</button>
        </div>
      )}
    </div>
    </div>
  );
}