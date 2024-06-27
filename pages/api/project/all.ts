import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession( { req });
  let userId;

  if (!session?.user.id) {
    return res.status(400).json({ message: 'Not Authorized' });
  } else {
    userId = session.user.id;
  }

  const userProjects = await prisma.user
    .findUnique({
      where: { id: userId},
    }).projects() || [];

  const projectShares = await prisma.projectShare
    .findMany({
      where: { userId },
    });

  const sharedProjectIds = projectShares.map((projectShare) => projectShare.projectId);

  // Get projects based on the extracted project IDs
  const sharedProjects = await prisma.project.findMany({
    where: { id: { in: sharedProjectIds } },
  });

  res.status(200).json(userProjects.concat(sharedProjects));
}