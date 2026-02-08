import { auth } from "@/lib/auth";
import DashboardLayoutClient from "@/components/layout/DashboardLayoutClient";
import prisma from "@/lib/prisma";
import "./tasks.css";

export default async function TasksPage() {
  const session = await auth();
  const user = session?.user;

  const tasks = await prisma.task.findMany({
    where: {
      OR: [
        { creatorId: user?.id },
        { assigneeId: user?.id },
      ],
    },
    orderBy: { updatedAt: "desc" },
    include: {
      project: { select: { id: true, name: true } },
      assignee: { select: { id: true, name: true, image: true } },
    },
  }).catch(() => []);

  const groupedTasks = {
    TODO: tasks.filter((t) => t.status === "TODO"),
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS"),
    IN_REVIEW: tasks.filter((t) => t.status === "IN_REVIEW"),
    COMPLETED: tasks.filter((t) => t.status === "COMPLETED"),
  };

  const columns = [
    { id: "TODO", title: "To Do", color: "var(--gray-500)" },
    { id: "IN_PROGRESS", title: "In Progress", color: "var(--primary-500)" },
    { id: "IN_REVIEW", title: "In Review", color: "var(--warning)" },
    { id: "COMPLETED", title: "Completed", color: "var(--success)" },
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

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <DashboardLayoutClient title="Tasks" user={user || {}}>
      <div className="tasks-page">
        <div className="page-header">
          <div className="page-header-content">
            <h2>Task Board</h2>
            <p>Drag and drop tasks to update their status</p>
          </div>
        </div>

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
                  {groupedTasks[column.id as keyof typeof groupedTasks].length}
                </span>
              </div>

              <div className="kanban-column-content">
                {groupedTasks[column.id as keyof typeof groupedTasks].map((task) => (
                  <div key={task.id} className="task-card">
                    <div className="task-card-header">
                      <span className={`task-priority ${getPriorityClass(task.priority)}`}>
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className="task-due-date">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          {formatDate(task.dueDate)}
                        </span>
                      )}
                    </div>

                    <h4 className="task-card-title">{task.title}</h4>
                    
                    {task.description && (
                      <p className="task-card-desc">{task.description}</p>
                    )}

                    <div className="task-card-footer">
                      <span className="task-project">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                        </svg>
                        {task.project.name}
                      </span>

                      {task.assignee && (
                        <div className="task-assignee" title={task.assignee.name || ""}>
                          <div className="avatar avatar-sm">
                            {task.assignee.image ? (
                              <img src={task.assignee.image} alt="" />
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
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {groupedTasks[column.id as keyof typeof groupedTasks].length === 0 && (
                  <div className="kanban-empty">
                    <p>No tasks</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayoutClient>
  );
}
