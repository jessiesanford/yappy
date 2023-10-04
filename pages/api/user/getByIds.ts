import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userIds } = req.body;
  console.log(userIds);

  if (!userIds || !Array.isArray(userIds)) {
    return res.status(400).json({ message: 'Invalid data format' });
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}