import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Data = {
  success: string
}

export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    const { email, handle, salt, hash } = req.body;
    await prisma.user.create({
      data: {
        email,
        handle,
        hash,
        salt,
      },
    });
    res.status(200).json({ success: 'very true' });
  }
};