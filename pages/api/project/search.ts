import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

interface Data {
  query?: string,
  projects: Array<any>,
  count: number,
}

interface Error {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  const text  = String(req.query.text) || '';
  const limit = Number(req.query.limit) || 100;

  try {
    const session = await getSession( { req });

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id: userId } = session.user;

    let count = await prisma.project.count();
    let projects = [];

    projects = await prisma.project.findMany({
      take: limit,
      where: {
        OR: [
          {
            AND: [
              { createdBy: userId },
              { name: { contains: text as string, mode: 'insensitive' } },
            ],
          },
          {
            AND: [
              { sharedUsers: { some: { id: userId } } },
              { name: { contains: text as string, mode: 'insensitive' } },
            ],
          },
        ],
      },
    });

    res.status(200).json({
      query: text,
      projects,
      count,
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error: ' + error });
  }
}