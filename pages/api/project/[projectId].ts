import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import type { Project } from '@prisma/client'
import { HTTP_STATUS } from '../../../static/enums/serverEnums';

const prisma = new PrismaClient();

type Data = {
  message?: string,
  project?: Project,
}

export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'GET') {
    const projectId = req.query.projectId as string;

    if (projectId) {
      const project = await prisma.project.findUnique({
        where: {
          id: projectId
        }
      });
      if (project) {
        res.status(200).json({ project: project });
      }
    } else {
      res.status(HTTP_STATUS.BAD_REQUEST);
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
};