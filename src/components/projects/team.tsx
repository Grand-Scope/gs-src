// import { User } from '@prisma/client';

interface ProjectTeamProps {
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
}

export default function ProjectTeam({ owner, members }: ProjectTeamProps) {
  return (
    <div className="grid grid-2 gap-6">
        <div className="card">
            <div className="card-header">
                <h3 className="text-lg font-semibold m-0">Project Owner</h3>
            </div>
            <div className="card-body">
                <div className="flex items-center gap-4">
                    <div className="avatar avatar-lg">
                        {owner.image ? (
                            <img src={owner.image} alt={owner.name || 'Owner'} />
                        ) : (
                            <span>{owner.name?.[0] || 'O'}</span>
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-lg">{owner.name}</p>
                        <p className="text-muted">{owner.email}</p>
                        <span className="badge badge-primary mt-2">Owner</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="card col-span-2">
            <div className="card-header">
                <h3 className="text-lg font-semibold m-0">Team Members ({members.length})</h3>
            </div>
            <div className="card-body">
                {members.length === 0 ? (
                    <p className="text-muted">No additional members on this project.</p>
                ) : (
                    <div className="grid grid-3 gap-4">
                        {members.map((member) => (
                            <div key={member.id} className="flex items-center gap-3 p-3 border border-color rounded hover:bg-tertiary transition-colors">
                                <div className="avatar">
                                    {member.image ? (
                                        <img src={member.image} alt={member.name || 'Member'} />
                                    ) : (
                                        <span>{member.name?.[0] || 'M'}</span>
                                    )}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-medium truncate">{member.name}</p>
                                    <p className="text-xs text-muted truncate">{member.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
