"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import DashboardLayoutClient from "@/components/layout/DashboardLayoutClient";
import TaskModal from "@/components/tasks/TaskModal";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import type { TaskWithRelations } from "@/types/task";
import type { TaskStatus } from "@prisma/client";
import "./tasks.css";

const columns = [
  { id: "TODO" as TaskStatus, title: "To Do", color: "var(--gray-500)" },
  { id: "IN_PROGRESS" as TaskStatus, title: "In Progress", color: "var(--primary-500)" },
  { id: "IN_REVIEW" as TaskStatus, title: "In Review", color: "var(--warning)" },
  { id: "COMPLETED" as TaskStatus, title: "Completed", color: "var(--success)" },
];

const getPriorityClass = (priority: string) => {
  const classes: Record<string, string> = {
    LOW: "priority-low",
    MEDIUM: "priority-medium",
    HIGH: "priority-high",
    URGENT: "priority-urgent",
  };
  return classes[priority] || "priority-medium";
};

const formatDate = (date: string | null) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export default function TasksPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [tasks, setTasks] = useState<TaskWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithRelations | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const groupedTasks: Record<TaskStatus, TaskWithRelations[]> = {
    TODO: tasks.filter((t) => t.status === "TODO"),
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS"),
    IN_REVIEW: tasks.filter((t) => t.status === "IN_REVIEW"),
    COMPLETED: tasks.filter((t) => t.status === "COMPLETED"),
  };

  const handleDragEnd = async (result: DropResult) => {
    const { draggableId, destination } = result;
    if (!destination) return;

    const newStatus = destination.droppableId as TaskStatus;
    const task = tasks.find((t) => t.id === draggableId);
    if (!task || task.status === newStatus) return;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === draggableId ? { ...t, status: newStatus } : t))
    );

    try {
      const res = await fetch(`/api/tasks/${draggableId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        // Revert on failure
        setTasks((prev) =>
          prev.map((t) => (t.id === draggableId ? { ...t, status: task.status } : t))
        );
      }
    } catch {
      // Revert on error
      setTasks((prev) =>
        prev.map((t) => (t.id === draggableId ? { ...t, status: task.status } : t))
      );
    }
  };

  const openCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEdit = (task: TaskWithRelations) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  return (
    <DashboardLayoutClient title="Tasks" user={user || {}}>
      <div className="tasks-page">
        <div className="page-header">
          <div className="page-header-content">
            <h2>Task Board</h2>
            <p>Drag and drop tasks to update their status</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Task
          </button>
        </div>

        {loading ? (
          <div className="kanban-loading">
            <div className="loader"></div>
            <p>Loading tasks...</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="kanban-board">
              {columns.map((column) => (
                <div key={column.id} className="kanban-column">
                  <div className="kanban-column-header">
                    <div className="kanban-column-title">
                      <span
                        className="kanban-column-dot"
                        style={{ background: column.color }}
                      ></span>
                      {column.title}
                    </div>
                    <span className="kanban-column-count">
                      {groupedTasks[column.id].length}
                    </span>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        className={`kanban-column-content ${
                          snapshot.isDraggingOver ? "drag-over" : ""
                        }`}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {groupedTasks[column.id].map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                className={`task-card ${
                                  snapshot.isDragging ? "dragging" : ""
                                }`}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => openEdit(task)}
                              >
                                <div className="task-card-header">
                                  <span
                                    className={`task-priority ${getPriorityClass(
                                      task.priority
                                    )}`}
                                  >
                                    {task.priority}
                                  </span>
                                  {task.dueDate && (
                                    <span className="task-due-date">
                                      <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      >
                                        <rect
                                          x="3"
                                          y="4"
                                          width="18"
                                          height="18"
                                          rx="2"
                                          ry="2"
                                        />
                                        <line
                                          x1="16"
                                          y1="2"
                                          x2="16"
                                          y2="6"
                                        />
                                        <line
                                          x1="8"
                                          y1="2"
                                          x2="8"
                                          y2="6"
                                        />
                                        <line
                                          x1="3"
                                          y1="10"
                                          x2="21"
                                          y2="10"
                                        />
                                      </svg>
                                      {formatDate(task.dueDate)}
                                    </span>
                                  )}
                                </div>

                                <h4 className="task-card-title">{task.title}</h4>

                                {task.description && (
                                  <p className="task-card-desc">
                                    {task.description}
                                  </p>
                                )}

                                <div className="task-card-footer">
                                  <span className="task-project">
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    >
                                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                    </svg>
                                    {task.project.name}
                                  </span>

                                  {task.assignee && (
                                    <div
                                      className="task-assignee"
                                      title={task.assignee.name || ""}
                                    >
                                      <div className="avatar avatar-sm">
                                        {task.assignee.image ? (
                                          <img
                                            src={task.assignee.image}
                                            alt=""
                                          />
                                        ) : (
                                          task.assignee.name?.[0] || "?"
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {task.progress > 0 && (
                                  <div className="task-card-progress">
                                    <div className="progress">
                                      <div
                                        className="progress-bar"
                                        style={{
                                          width: `${task.progress}%`,
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}

                        {groupedTasks[column.id].length === 0 && (
                          <div className="kanban-empty">
                            <p>No tasks</p>
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        )}
      </div>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchTasks}
        task={editingTask}
      />
    </DashboardLayoutClient>
  );
}
