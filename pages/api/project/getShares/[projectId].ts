import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { projectId } = req.query;

  try {
    const projectShares = await prisma.projectShare.findMany({
      where: {
        projectId: projectId
      },
    });

    res.send(JSON.stringify(projectShares, null, 2));
  } catch (e) {
    res.status(400).json([]);
  }
}