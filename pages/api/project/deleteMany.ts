import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Data = {}

export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {
  const body = req.body;
  const { ids } = body;

  if (req.method === 'POST') {
    // delete project shares associated with project
    await prisma.projectShare.deleteMany({
      where: {
        projectId: {
          in: ids
        }
      }
    });
    await prisma.project.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    });
    res.status(200).json({ success: `Project with ids ${ids.toString()}` });
  }
};