import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

type Data = {

}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const projectId = req.query.projectId as string;

  try {
    const projectShares = await prisma.projectShare.findMany({
      where: {
        projectId: projectId
      },
    });

    res.send(JSON.stringify(projectShares, null, 2));
  } catch (e) {
    res.status(400).json([]);
  }
}