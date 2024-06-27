import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { User } from 'next-auth';

const prisma = new PrismaClient();

export default async function (req: NextApiRequest, res: NextApiResponse<User | { error: string }>) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(401).send({error: 'Validation parameters not supplied.'});
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (user) {
    const checkHash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');

    if (checkHash === user.hash) {
      res.status(200).send(user);
    } else {
      res.status(401).send({ error: 'Password is incorrect.' });
    }
  } else {
    res.status(401).send({ error: 'Email is incorrect.' });
  }
};