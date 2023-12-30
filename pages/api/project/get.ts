import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Data = {
}

export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    if (req.method === 'GET') {
      const PROJECTS = await prisma.project.findMany();
      res.send(JSON.stringify(PROJECTS, null, 2));
    } else {
      res.status(405).json([]);
    }
  } catch (e) {
    res.status(400).json([]);
  }
};