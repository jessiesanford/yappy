import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Data = {
}

export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {
  const query = req.query;
  const { text } = query;

  const USERS = await prisma.user.findMany({
    where: {
      email: {
        contains: text
      }
    },
    select: {
      id: true,
      handle: true,
      email: true,
    }
  });

  if (USERS) {
    res.json(USERS);
  } else {
    res.json([]);
  }

  // res.send(JSON.stringify(USERS, null, 2));
};