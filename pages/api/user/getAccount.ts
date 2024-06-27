import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getSession( { req });

  if (!session?.user.id) {
    return res.status(400).json({ message: 'Not Authorized' });
  }

  try {
    const users = await prisma.user.findUnique({
      where: {
        id: session?.user.id,
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}