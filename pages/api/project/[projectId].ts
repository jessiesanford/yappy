import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import type { Project } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

type Data = {
  message?: string,
  project?: Project,
  error?: string,
}

export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {
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

// export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {
//   if (req.method === 'GET') {
//     const session = await getSession({ req });
//     const projectId = req.query.projectId as string;
//     console.log(session);
//     res.status(200).json({ session: session?.user })
//
//
//     if (session?.user && projectId) {
//       const project = await prisma.project.findFirst({
//         where: {
//           id: projectId,
//           createdBy: session.user.id
//         }
//       });
//
//       return res.status(200).json({ project })
//
//       // if (project) {
//       //   if (project.createdUser.id !== session.user.id && project.sharedUsers.length === 0) {
//       //     res.status(403).json({ error: 'Access forbidden' });
//       //   }
//       //
//       //   res.status(200).json({ project });
//       // } else {
//       //   res.status(404).json({ error: 'Not found' });
//       // }
//     } else {
//       res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Testing' });
//     }
//   } else {
//     res.status(405).json({ message: 'Method Not Allowed' });
//   }
// };