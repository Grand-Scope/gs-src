'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function getProjectById(id: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        members: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        tasks: {
            include: {
                assignee: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        },
        milestones: {
            orderBy: {
                date: 'asc'
            }
        },
      },
    });

    return project;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}
