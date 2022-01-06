import { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "@/next-auth/client";
import prisma from "@/lib/prisma";

export default async function provideUserProfileService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) {
    return;
  }

  const userId = session.user.id as string;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  res.status(200).json({
    code: 0,
    msg: "",
    data: user,
  });
}
