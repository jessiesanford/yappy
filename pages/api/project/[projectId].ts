import excuteQuery from '../../../lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Data = {
}

export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {
  const { projectId } = req.query;
  console.log(projectId);
  const PROJECT = await prisma.project.findUnique({
    where: {
      id: projectId
    }
  });
  res.send(JSON.stringify(PROJECT, null, 2));
};

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   excuteQuery({
//     query: 'SELECT * FROM projects WHERE id = 1',
//   }).then((queryResults) => {
//     res.status(200).json(queryResults[0]);
//   });
// }