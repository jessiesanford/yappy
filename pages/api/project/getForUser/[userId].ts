import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { userId } = req.query;

  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { createdBy: userId }, // Projects owned by the user
        { sharedWith: { some: { shared_with_id: userId } } }, // Projects shared with the user
      ],
    },
  });

  return projects;
}