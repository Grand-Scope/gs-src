import { auth } from "@/lib/auth";
import DashboardLayoutClient from "@/components/layout/DashboardLayoutClient";
import prisma from "@/lib/prisma";
import "./members.css";

export default async function MembersPage() {
  const session = await auth();
  const user = session?.user;

  const members = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          ownedProjects: true,
          projects: true,
          tasks: true,
          createdTasks: true,
        },
      },
    },
  }).catch(() => []);

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      ADMIN: "badge-danger",
      MANAGER: "badge-primary",
      MEMBER: "badge-info",
    };
    return styles[role] || "badge-info";
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DashboardLayoutClient title="Team Members" user={user || {}}>
      <div className="members-page">
        <div className="page-header">
          <div className="page-header-content">
            <h2>Team Members</h2>
            <p>View and manage your team</p>
          </div>
        </div>

        {members.length > 0 ? (
          <div className="members-grid">
            {members.map((member) => (
              <div key={member.id} className="member-card card">
                <div className="member-card-header">
                  <div className="avatar avatar-lg">
                    {member.image ? (
                      <img src={member.image} alt={member.name || ""} />
                    ) : (
                      getInitials(member.name)
                    )}
                  </div>
                  {member.id === user?.id && (
                    <span className="member-you-badge">You</span>
                  )}
                </div>

                <div className="member-card-body">
                  <h3 className="member-name">{member.name || "Unknown User"}</h3>
                  <p className="member-email">{member.email}</p>
                  <span className={`badge ${getRoleBadge(member.role)}`}>
                    {member.role}
                  </span>
                </div>

                <div className="member-card-stats">
                  <div className="member-stat">
                    <span className="member-stat-value">{member._count.ownedProjects + member._count.projects}</span>
                    <span className="member-stat-label">Projects</span>
                  </div>
                  <div className="member-stat">
                    <span className="member-stat-value">{member._count.tasks + member._count.createdTasks}</span>
                    <span className="member-stat-label">Tasks</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state-large">
            <div className="empty-state-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3>No team members</h3>
            <p>Members will appear here once they sign up</p>
          </div>
        )}
      </div>
    </DashboardLayoutClient>
  );
}
