import Link from 'next/link';
import { Project, ProjectStatus } from '@prisma/client';

interface ProjectHeaderProps {
  project: Project;
}

export default function ProjectHeader({ project }: ProjectHeaderProps) {
  const statusColors = {
    [ProjectStatus.PLANNING]: 'badge-info',
    [ProjectStatus.IN_PROGRESS]: 'badge-primary',
    [ProjectStatus.ON_HOLD]: 'badge-warning',
    [ProjectStatus.COMPLETED]: 'badge-success',
    [ProjectStatus.CANCELLED]: 'badge-danger',
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="card mb-6">
      <div className="card-body">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="m-0 text-xl font-bold">{project.name}</h1>
                <span className={`badge ${statusColors[project.status]}`}>
                  {project.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-muted">{project.description || 'No description provided'}</p>
            </div>
            
             <Link href={`/dashboard/projects/${project.id}/edit`} className="btn btn-secondary btn-sm">
                Edit Project
             </Link>
          </div>

          <div className="grid grid-4 gap-4 mt-4">
             <div className="p-4 bg-tertiary rounded">
                <p className="text-xs text-muted font-medium uppercase mb-1">Start Date</p>
                <p className="font-semibold">{formatDate(project.startDate)}</p>
             </div>
             <div className="p-4 bg-tertiary rounded">
                <p className="text-xs text-muted font-medium uppercase mb-1">End Date</p>
                <p className="font-semibold">{formatDate(project.endDate)}</p>
             </div>
             <div className="p-4 bg-tertiary rounded">
                <p className="text-xs text-muted font-medium uppercase mb-1">Progress</p>
                 <div className="flex items-center gap-2">
                    <div className="progress">
                        <div 
                            className="progress-bar" 
                            style={{ width: `${project.progress}%` }}
                        ></div>
                    </div>
                    <span className="text-sm font-medium">{project.progress}%</span>
                 </div>
             </div>
             <div className="p-4 bg-tertiary rounded">
                <p className="text-xs text-muted font-medium uppercase mb-1">Created</p>
                <p className="font-semibold">{formatDate(project.createdAt)}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
