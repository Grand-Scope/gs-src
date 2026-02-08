import { Project, Milestone } from '@prisma/client';

interface ProjectOverviewProps {
  project: Project & {
    milestones: Milestone[];
  };
}

export default function ProjectOverview({ project }: ProjectOverviewProps) {
  return (
    <div className="grid grid-3 gap-6">
      <div className="col-span-2 space-y-6">
        <div className="card">
            <div className="card-header">
                <h3 className="text-lg font-semibold m-0">About Project</h3>
            </div>
            <div className="card-body">
                <p className="text-secondary leading-relaxed">
                    {project.description || 'No detailed description available for this project.'}
                </p>
            </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="card">
            <div className="card-header flex justify-between items-center">
                <h3 className="text-lg font-semibold m-0">Milestones</h3>
            </div>
            <div className="card-body p-0">
                {project.milestones.length === 0 ? (
                    <div className="p-5 text-center text-muted text-sm">
                        No milestones yet
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {project.milestones.map((milestone) => (
                             <div key={milestone.id} className="p-4 border-b border-color last:border-0 flex items-start gap-3">
                                <div className={`mt-1 w-3 h-3 rounded-full ${milestone.completed ? 'bg-success' : 'bg-gray-300'}`}></div>
                                <div>
                                    <p className={`font-medium ${milestone.completed ? 'text-muted line-through' : ''}`}>
                                        {milestone.name}
                                    </p>
                                    <p className="text-xs text-muted">
                                        {new Date(milestone.date).toLocaleDateString()}
                                    </p>
                                </div>
                             </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
