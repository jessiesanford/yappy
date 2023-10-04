import { PrismaClient } from '@prisma/client';
import { NextAPIRequest, NextAPIResponse } from 'next';

const prisma = new PrismaClient();

export default async function ( req: NextAPIRequest, res: NextAPIResponse) {
  const body = req.body;
  const { id, data } = body;
  const { name } = data;

  if (req.method === 'POST') {
    await prisma.project.update({
      where: {
        id: id
      },
      data: {
        name,
      }
    });

    res.status(200).json({ success: 'Project data successfully updated.' });
  }
}