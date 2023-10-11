import { PrismaClient } from '@prisma/client';
import { getSession, useSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

interface Data {

}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const text  = String(req.query.text) || '';

  try {
    const session = await getSession( { req });

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id: userId } = session.user;

    let projects = [];
    projects = await prisma.project.findMany({
      where: {
        OR: [
          {
            AND: [
              { createdBy: userId },
              { name: { contains: text, mode: 'insensitive' } },
            ],
          },
          {
            AND: [
              { sharedUsers: { some: { id: userId } } },
              { name: { contains: text, mode: 'insensitive' } },
            ],
          },
        ],
      },
    });

    res.status(200).json({
      query: text,
      projects
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error: ' + error });
  }
}