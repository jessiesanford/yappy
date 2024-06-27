import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { HTTP_STATUS } from '../../../static/enums/serverEnums';

const prisma = new PrismaClient();

type Data = {

}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getSession( { req });

  if (!session?.user.id) {
    return res.status(400).json({ message: 'Not Authorized' });
  }

  try {
    const userWithSalt = await prisma.user.findUnique({
      where: {
        id: session?.user.id,
      },
      select: {
        salt: true
      }
    });

    if (userWithSalt) {
      return res.status(HTTP_STATUS.OK).json(userWithSalt);
    } else {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error'});
    }

  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
  }
}