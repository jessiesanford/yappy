import {NextApiRequest, NextApiResponse} from 'next';
import {PrismaClient} from '@prisma/client';
import {getSession} from "next-auth/react";
import {ServerResponses} from "../../../static/constants";

const prisma = new PrismaClient();

type Data = {
  success?: boolean,
  error?: string,
  message?: string,
}

export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: ServerResponses.UNAUTHORIZED_METHOD });
  }

  try {
    const session = await getSession({req});

    if (!session) {
      return res.status(401).json({ error: ServerResponses.UNAUTHORIZED_ACCESS });
    }

    const { id: userId } = session.user;
    const {salt, hash} = req.body;

    await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        hash,
        salt,
      },
    });
    res.status(200).json({success: true, message: `Password for uid: ${userId} updated`});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({error: `${ServerResponses.INTERNAL_ERROR}: ${error}`});
  }
};