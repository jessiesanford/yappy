import excuteQuery from '../../../lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { useSession } from 'next-auth/react';

const prisma = new PrismaClient();

type Data = {
}

export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const PROJECTS = await prisma.project.findMany();
    res.send(JSON.stringify(PROJECTS, null, 2));
  } catch (e) {
    res.status(400).json([]);
  }
};