import { NextApiRequest, NextApiResponse } from "next";

import { resp, ensureLogin } from "@/lib/utils";
import prisma from "@/lib/prisma";

export default async function provideUserProfileUpdateService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);

  const { nickname, avatar } = req.body;

  await prisma.profile.update({
    where: {
      user_id,
    },
    data: {
      nickname,
      avatar,
    },
  });

  resp(null, res);
}
