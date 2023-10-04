import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { userId } = req.query;

  try {
    const users = await prisma.user.findMany({
      where: {
        id: userId
      },
      select: {
        id: true,
        handle: true,
        name: true,
        email: true,
        registeredAt: true,
        lastActiveAt: true,
      }
    });

    res.send(JSON.stringify(users, null, 2));
  } catch (e) {
    res.status(400).json([]);
  }
}