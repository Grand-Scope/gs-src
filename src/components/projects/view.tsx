'use client';

import { useState } from 'react';
import { Project, Task, Milestone } from '@prisma/client';
import ProjectHeader from './header';
import ProjectOverview from './overview';
import ProjectTasks from './tasks';
import ProjectTeam from './team';

type ProjectWithDetails = Project & {
  owner: {
    id: string;
    name: string | null;
    image: string | null;
    email: string | null;
  };
  members: {
    id: string;
    name: string | null;
    image: string | null;
    email: string | null;
  }[];
  tasks: (Task & {
    assignee: {
      id: string;
      name: string | null;
      image: string | null;
    } | null;
  })[];
  milestones: Milestone[];
};

interface ProjectViewProps {
  project: ProjectWithDetails;
}

export default function ProjectView({ project }: ProjectViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'team'>('overview');

  return (
    <div className="p-6">
      <ProjectHeader project={project} />

      <div className="mb-6 border-b border-color">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-muted hover:text-primary'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'tasks'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-muted hover:text-primary'
            }`}
          >
            Tasks
            <span className="ml-2 badge badge-info text-xs py-0.5 px-1.5">{project.tasks.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'team'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-muted hover:text-primary'
            }`}
          >
            Team
            <span className="ml-2 badge badge-info text-xs py-0.5 px-1.5">{project.members.length + 1}</span>
          </button>
        </div>
      </div>

      <div className="animate-fade-in">
        {activeTab === 'overview' && <ProjectOverview project={project} />}
        {activeTab === 'tasks' && <ProjectTasks tasks={project.tasks} projectId={project.id} />}
        {activeTab === 'team' && <ProjectTeam owner={project.owner} members={project.members} />}
      </div>
    </div>
  );
}
