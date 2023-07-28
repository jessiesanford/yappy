import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

type Data = {

}

export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {
  const body = req.body;
  const { projectId, emails, users } = body;

  console.log(projectId, emails, users);

  for (const email of emails) {
    const user = users[email];

    if (user) {
      console.log('creating project share for user');
      // await prisma.projectShare.create({
      //   data: {
      //     projectId,
      //     userId: user.id, // Associate the project with the existing user
      //   },
      // });
      await prisma.projectShare.upsert({
        where: {
          projectId_userId: {
            projectId,
            userId: user.id,
          },
        },
        create: {
          projectId: projectId,
          userId: user.id,
        },
        update: {
          projectId: projectId,
          userId: user.id,
        }
      }).then((e) => {
        console.log(e);
      }).catch((e) => {
        console.log('error:');
        console.log(e);
      });
    } else {
      console.log('creating project share for email', email)
      await prisma.projectShare.create({
        data: {
          projectId,
          inviteEmail: email,
        },
      });
      // await prisma.projectShare.upsert({
      //   where: {
      //     projectId: projectId,
      //     inviteEmail: user.id
      //   },
      //   create: {
      //     projectId: projectId,
      //     inviteEmail: user.id,
      //   },
      //   update: {
      //     projectId: projectId,
      //     inviteEmail: user.id,
      //   }
      // });
    }

  }

  res.status(200).json({ success: 'very true' });
}