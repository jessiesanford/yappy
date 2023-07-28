import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
type Data = {

}

export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {
  const body = req.body;
  const { ids } = body;

  if (req.method === 'POST') {
    await prisma.project.updateMany({
      where: {
        id: {
          in: ids
        }
      },
      data: {
        isTrashed: true,
      }
    });

    res.status(200).json({ success: 'Projects successfully moved to trash.' });
  }
};