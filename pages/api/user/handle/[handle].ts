import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { useRouter } from 'next/router';

const prisma = new PrismaClient();

type Data = {
  handle?: string
}

export default async function (req: NextApiRequest, res: NextApiResponse<Data | null>) {
  const query = req.query;
  const { handle } = query;

  const user = await prisma.user.findUnique({
    where: {
      handle,
    },
    select: {
      handle: true,
    }
  });

  if (user) {
    res.json(user);
  } else {
    res.json({});
  }
};