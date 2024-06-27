import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
type Data = {

}

export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {
  const body = req.body;
  const { id } = body;

  if (req.method === 'POST') {
    const { name } = req.body;
    await prisma.project.update({
      where: {
        id: id
      },
      data: {
        isTrashed: true,
      }
    });

    res.status(200).json({ success: 'very true' });
  }
};