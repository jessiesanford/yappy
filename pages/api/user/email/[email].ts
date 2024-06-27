import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Data = {
  email?: string
}

export default async function (req: NextApiRequest, res: NextApiResponse<Data | null>) {
  const query = req.query;
  const { email } = query;

  const user = await prisma.user.findUnique({
    where: {
      // @ts-ignore
      email,
    },
    select: {
      email: true,
    }
  });

  if (user) {
    res.json(user);
  } else {
    res.json({});
  }
};