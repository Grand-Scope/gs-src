"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import type { TaskWithRelations, TaskFormData } from "@/types/task";
import "./task-modal.css";

interface Project {
  id: string;
  name: string;
  members?: { id: string; name: string | null }[];
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  task?: TaskWithRelations | null;
  defaultProjectId?: string;
  defaultDate?: string;
}

const emptyForm: TaskFormData = {
  title: "",
  description: "",
  projectId: "",
  assigneeId: "",
  priority: "MEDIUM",
  status: "TODO",
  startDate: "",
  dueDate: "",
};

function toDateInput(val: string | null | undefined): string {
  if (!val) return "";
  return new Date(val).toISOString().split("T")[0];
}

export default function TaskModal({
  isOpen,
  onClose,
  onSaved,
  task,
  defaultProjectId,
  defaultDate,
}: TaskModalProps) {
  const [formData, setFormData] = useState<TaskFormData>(emptyForm);
  const [projects, setProjects] = useState<Project[]>([]);
  const [members, setMembers] = useState<{ id: string; name: string | null }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch projects list
  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProjects(data);
      })
      .catch(() => {});
  }, [isOpen]);

  // Populate form when opening
  useEffect(() => {
    if (!isOpen) return;
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        projectId: task.projectId,
        assigneeId: task.assigneeId || "",
        priority: task.priority,
        status: task.status,
        startDate: toDateInput(task.startDate),
        dueDate: toDateInput(task.dueDate),
      });
    } else {
      setFormData({
        ...emptyForm,
        projectId: defaultProjectId || "",
        dueDate: defaultDate || "",
        startDate: defaultDate || "",
      });
    }
    setError("");
    setShowDeleteConfirm(false);
  }, [isOpen, task, defaultProjectId, defaultDate]);

  // Fetch project members when projectId changes
  useEffect(() => {
    if (!formData.projectId) {
      setMembers([]);
      return;
    }
    fetch(`/api/projects/${formData.projectId}`)
      .then((r) => r.json())
      .then((data) => {
        const allMembers: { id: string; name: string | null }[] = [];
        if (data.owner) allMembers.push(data.owner);
        if (data.members) {
          for (const m of data.members) {
            if (!allMembers.find((x) => x.id === m.id)) allMembers.push(m);
          }
        }
        setMembers(allMembers);
      })
      .catch(() => setMembers([]));
  }, [formData.projectId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const url = task ? `/api/tasks/${task.id}` : "/api/tasks";
      const method = task ? "PUT" : "POST";

      const body: Record<string, unknown> = {
        title: formData.title,
        description: formData.description || null,
        projectId: formData.projectId,
        assigneeId: formData.assigneeId || null,
        priority: formData.priority,
        status: formData.status,
        startDate: formData.startDate || null,
        dueDate: formData.dueDate || null,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save task");
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete task");
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modal = (
    <div className="task-modal-overlay" onClick={handleOverlayClick}>
      <div className="task-modal">
        <div className="task-modal-header">
          <h2>{task ? "Edit Task" : "New Task"}</h2>
          <button className="task-modal-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="task-modal-body">
          <form onSubmit={handleSubmit} className="task-modal-form" id="task-form">
            {error && <div className="form-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="task-title" className="label">
                Title <span className="required">*</span>
              </label>
              <input
                type="text"
                id="task-title"
                name="title"
                className="input"
                placeholder="Task title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="task-description" className="label">
                Description
              </label>
              <textarea
                id="task-description"
                name="description"
                className="input textarea"
                placeholder="Describe the task..."
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="task-project" className="label">
                  Project <span className="required">*</span>
                </label>
                <select
                  id="task-project"
                  name="projectId"
                  className="input select"
                  value={formData.projectId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="task-assignee" className="label">
                  Assignee
                </label>
                <select
                  id="task-assignee"
                  name="assigneeId"
                  className="input select"
                  value={formData.assigneeId}
                  onChange={handleChange}
                >
                  <option value="">Unassigned</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name || "Unnamed"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="task-priority" className="label">
                  Priority
                </label>
                <select
                  id="task-priority"
                  name="priority"
                  className="input select"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="task-status" className="label">
                  Status
                </label>
                <select
                  id="task-status"
                  name="status"
                  className="input select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="IN_REVIEW">In Review</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="task-start" className="label">
                  Start Date
                </label>
                <input
                  type="date"
                  id="task-start"
                  name="startDate"
                  className="input"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="task-due" className="label">
                  Due Date
                </label>
                <input
                  type="date"
                  id="task-due"
                  name="dueDate"
                  className="input"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </form>
        </div>

        <div className="task-modal-footer">
          <div>
            {task && !showDeleteConfirm && (
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting}
              >
                Delete
              </button>
            )}
            {task && showDeleteConfirm && (
              <div className="task-delete-confirm">
                <span className="text-sm text-danger">Delete this task?</span>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  Yes, delete
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className="task-modal-footer-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              form="task-form"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : task ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
