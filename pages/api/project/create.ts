import moment from 'moment';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Data = {
  success: string
}

export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    const { name, createdBy, updatedBy, ownerId } = req.body;
    await prisma.project.create({
      data: {
        name,
        description: '',
        createdBy,
        updatedBy,
      },
    });
    res.status(200).json({ success: 'very true' });
  }
};