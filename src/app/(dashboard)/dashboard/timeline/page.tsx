import { auth } from "@/lib/auth";
import DashboardLayoutClient from "@/components/layout/DashboardLayoutClient";
import prisma from "@/lib/prisma";
import "./timeline.css";

export default async function TimelinePage() {
  const session = await auth();
  const user = session?.user;

  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: user?.id },
        { members: { some: { id: user?.id } } },
      ],
      startDate: { not: null },
    },
    orderBy: { startDate: "asc" },
    include: {
      tasks: {
        where: {
          OR: [
            { startDate: { not: null } },
            { dueDate: { not: null } },
          ],
        },
        orderBy: { dueDate: "asc" },
      },
      milestones: {
        orderBy: { date: "asc" },
      },
    },
  }).catch(() => []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PLANNING: "var(--info)",
      IN_PROGRESS: "var(--primary-500)",
      ON_HOLD: "var(--warning)",
      COMPLETED: "var(--success)",
      CANCELLED: "var(--danger)",
    };
    return colors[status] || "var(--gray-400)";
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const calculateDuration = (start: Date | null, end: Date | null) => {
    if (!start || !end) return "—";
    const days = Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));
    return `${days} days`;
  };

  return (
    <DashboardLayoutClient title="Timeline" user={user || {}}>
      <div className="timeline-page">
        <div className="page-header">
          <div className="page-header-content">
            <h2>Project Timeline</h2>
            <p>Visualize your project schedules and milestones</p>
          </div>
        </div>

        {projects.length > 0 ? (
          <div className="timeline-container">
            {projects.map((project) => (
              <div key={project.id} className="timeline-project">
                <div className="timeline-project-header">
                  <div className="timeline-project-info">
                    <div
                      className="timeline-project-indicator"
                      style={{ background: getStatusColor(project.status) }}
                    ></div>
                    <div>
                      <h3 className="timeline-project-name">{project.name}</h3>
                      <div className="timeline-project-dates">
                        {formatDate(project.startDate)} – {formatDate(project.endDate)}
                        <span className="timeline-duration">
                          ({calculateDuration(project.startDate, project.endDate)})
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="timeline-project-progress">
                    <span className="progress-label">{project.progress}%</span>
                    <div className="progress" style={{ width: "100px" }}>
                      <div
                        className="progress-bar"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Tasks Timeline */}
                {project.tasks.length > 0 && (
                  <div className="timeline-tasks">
                    {project.tasks.map((task) => (
                      <div key={task.id} className="timeline-task">
                        <div className="timeline-task-connector"></div>
                        <div className="timeline-task-content">
                          <div className="timeline-task-title">{task.title}</div>
                          <div className="timeline-task-dates">
                            {task.startDate && formatDate(task.startDate)}
                            {task.startDate && task.dueDate && " – "}
                            {task.dueDate && formatDate(task.dueDate)}
                          </div>
                        </div>
                        <span className={`badge badge-${task.status === "COMPLETED" ? "success" : "primary"}`}>
                          {task.status.replace("_", " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Milestones */}
                {project.milestones.length > 0 && (
                  <div className="timeline-milestones">
                    <div className="timeline-milestones-title">Milestones</div>
                    <div className="timeline-milestones-list">
                      {project.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className={`timeline-milestone ${milestone.completed ? "completed" : ""}`}
                        >
                          <div className="timeline-milestone-icon">
                            {milestone.completed ? (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : (
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            )}
                          </div>
                          <div className="timeline-milestone-info">
                            <div className="timeline-milestone-name">{milestone.name}</div>
                            <div className="timeline-milestone-date">{formatDate(milestone.date)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state-large">
            <div className="empty-state-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </div>
            <h3>No timeline data</h3>
            <p>Create projects with start and end dates to see them here</p>
          </div>
        )}
      </div>
    </DashboardLayoutClient>
  );
}
