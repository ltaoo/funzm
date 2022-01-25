import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { ensureLogin, resp } from "@/lib/utils";

export default async function provideUserProfileService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);
  const user = await prisma.user.findUnique({
    where: {
      id: user_id,
    },
    include: {
      profile: true,
      score: true,
    },
  });

  if (!user) {
    return resp(12000, res);
  }
  return resp(
    {
      email: user.email,
      nickname: user.profile?.nickname,
      avatar: user.profile?.avatar,
      score: user.score?.value,
    },
    res
  );
}
