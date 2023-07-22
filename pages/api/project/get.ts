import excuteQuery from '../../../lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Data = {
}

export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const PROJECTS = await prisma.project.findMany();
    res.send(JSON.stringify(PROJECTS, null, 2));
  } catch (e) {
    console.log(e);
    res.status(400).json([]);
  }
};

// local - db
// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   excuteQuery({
//     query: 'SELECT * FROM projects',
//   }).then((queryResults) => {
//     res.status(200).json(queryResults[0])
//   });
// }