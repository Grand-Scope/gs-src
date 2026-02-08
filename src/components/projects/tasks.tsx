"use client";

import { useState } from "react";
import { Task, TaskStatus, Priority } from "@prisma/client";
import TaskModal from "@/components/tasks/TaskModal";
import type { TaskWithRelations } from "@/types/task";

interface ProjectTasksProps {
  tasks: (Task & {
    assignee: {
      id: string;
      name: string | null;
      image: string | null;
    } | null;
  })[];
  projectId: string;
}

export default function ProjectTasks({ tasks, projectId }: ProjectTasksProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithRelations | null>(null);

  const statusColors = {
    [TaskStatus.TODO]: "badge-warning",
    [TaskStatus.IN_PROGRESS]: "badge-primary",
    [TaskStatus.IN_REVIEW]: "badge-info",
    [TaskStatus.COMPLETED]: "badge-success",
  };

  const priorityColors = {
    [Priority.LOW]: "text-muted",
    [Priority.MEDIUM]: "text-info",
    [Priority.HIGH]: "text-warning",
    [Priority.URGENT]: "text-danger font-bold",
  };

  const openCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEdit = (task: ProjectTasksProps["tasks"][number]) => {
    setEditingTask({
      ...task,
      startDate: task.startDate ? task.startDate.toString() : null,
      dueDate: task.dueDate ? task.dueDate.toString() : null,
      createdAt: task.createdAt.toString(),
      updatedAt: task.updatedAt.toString(),
      project: { id: projectId, name: "" },
    });
    setModalOpen(true);
  };

  const handleSaved = () => {
    // Reload the page to get fresh server data
    window.location.reload();
  };

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        <h3 className="text-lg font-semibold m-0">Tasks</h3>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>
          + New Task
        </button>
      </div>
      <div className="card-body p-0">
        {tasks.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted mb-4">No tasks found for this project</p>
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-tertiary text-xs uppercase text-muted border-b border-color">
                  <th className="p-4 font-medium">Task</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Priority</th>
                  <th className="p-4 font-medium">Assignee</th>
                  <th className="p-4 font-medium">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task.id}
                    className="border-b border-color last:border-0 hover:bg-tertiary transition-colors"
                    style={{ cursor: "pointer" }}
                    onClick={() => openEdit(task)}
                  >
                    <td className="p-4">
                      <p className="font-medium">{task.title}</p>
                    </td>
                    <td className="p-4">
                      <span className={`badge ${statusColors[task.status]}`}>
                        {task.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-medium ${priorityColors[task.priority]}`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      {task.assignee ? (
                        <div className="flex items-center gap-2">
                          <div className="avatar avatar-sm">
                            {task.assignee.image ? (
                              <img
                                src={task.assignee.image}
                                alt={task.assignee.name || "User"}
                              />
                            ) : (
                              <span>{task.assignee.name?.[0] || "U"}</span>
                            )}
                          </div>
                          <span className="text-sm">{task.assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted italic">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-muted">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
        task={editingTask}
        defaultProjectId={projectId}
      />
    </div>
  );
}
