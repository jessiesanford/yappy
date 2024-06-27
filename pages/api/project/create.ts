import moment from 'moment';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { HTTP_STATUS } from '../../../static/enums/serverEnums';

const prisma = new PrismaClient();

type Data = {
  success?: string,
  message?: string,
}

export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    const { name, createdBy, updatedBy } = req.body;

    if (!name || !createdBy || !updatedBy) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: 'Missing name, createdBy, or updatedBy parameters' });
    } else {
      await prisma.project.create({
        data: {
          name,
          description: '',
          createdBy,
          updatedBy,
        },
      });
      res.status(HTTP_STATUS.OK).json({ success: 'Project Created Successfully' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
};