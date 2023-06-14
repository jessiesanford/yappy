import moment from 'moment';
import excuteQuery from '../../../lib/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Data = {
  success: string
}


export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    const { name } = req.body;
    await prisma.project.create({
      data: {
        name,
        description: '',
        createdAt: new Date(moment().format('YYYY-MM-DD HH:mm:ss')),
        createdBy: '',
        updatedAt: new Date(moment().format('YYYY-MM-DD HH:mm:ss')),
        updatedBy: '',
      },
    });
    res.status(200).json({ success: 'very true' });
  }
};

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   excuteQuery({
//     query: 'INSERT INTO projects (type, name, description, createdDate, createdUser, lastModifiedDate, lastModifiedUser) VALUES (?, ?, ?, ?, ?, ?, ?)',
//     values: [
//       'game',
//       req.body.name,
//       '',
//       moment().format('YYYY-MM-DD HH:mm:ss'),
//       0,
//       moment().format('YYYY-MM-DD HH:mm:ss'),
//       0
//     ],
//   }).then((queryResults) => {
//     res.status(200).json(queryResults[0])
//   }).catch((error) => {
//     res.status(500)
//   });
// }