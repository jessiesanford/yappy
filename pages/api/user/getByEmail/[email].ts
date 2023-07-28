import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Data = {
}

export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {
  const query = req.query;
  const { email } = query;

  const user = await prisma.user.findUnique({
    where: {
      email: email
    },
    select: {
      id: true,
      handle: true,
      email: true,
    }
  });

  res.json(user);
};