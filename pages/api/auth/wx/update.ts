/**
 * @file 更新二维码登录状态
 */
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";

export default async function provideWeappQrcodeStatusCheckService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { token, status } = req.query as { token: string; status: string };

  const existing = await prisma.verificationToken.findFirst({
    where: {
      token,
    },
  });

  if (existing) {
    const { expires } = existing;
  }
}
