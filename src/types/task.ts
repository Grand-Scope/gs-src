import type { TaskStatus, Priority } from "@prisma/client";

export interface TaskWithRelations {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  startDate: string | null;
  dueDate: string | null;
  progress: number;
  projectId: string;
  assigneeId: string | null;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  project: { id: string; name: string };
  assignee: { id: string; name: string | null; image: string | null } | null;
  creator?: { id: string; name: string | null; image: string | null };
}

export interface TaskFormData {
  title: string;
  description: string;
  projectId: string;
  assigneeId: string;
  priority: Priority;
  status: TaskStatus;
  startDate: string;
  dueDate: string;
}
