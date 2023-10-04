import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Data = {

}

export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {
  const body = req.body;
  const { projectId } = body;

  if (req.method === 'POST') {
    await prisma.projectShare.deleteMany({
      where: {
        id: projectId
      }
    });
    res.status(200).json({ success: 'Endpoint Resolved Successfully' });
  }
};