import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";

const prisma = new PrismaClient();

export default async function handler(req, res) {
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
    }).projects();

  const sharedProjects = await prisma.projectShare
    .findMany({
      where: {
        userId
      },
    })

  let sP = sharedProjects.map((projectShare) => projectShare.project());
  let allProjects = [userProjects, ...sP];

  // const projects = await prisma.project.findMany({
  //   where: {
  //     OR: [
  //       {
  //         createdBy: userId
  //       }, // Projects owned by the user
  //       {
  //         sharedWith: { some: { shared_with_id: userId } } }, // Projects shared with the user
  //     ],
  //   },
  // });

  res.status(200).json(userProjects);
}