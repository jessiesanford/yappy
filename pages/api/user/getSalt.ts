import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

type Data = {
  message?: string,
  project?: Prisma.ProjectCreateInput,
}

export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'GET') {
    const { projectId } = req.query;

    const salt = await prisma.user.findUnique

    const PROJECT = await prisma.project.findUnique({
      where: {
        id: projectId
      }
    });
    res.status(200).json({ project: PROJECT });
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
};