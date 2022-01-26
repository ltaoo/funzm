/**
 * @file 小程序扫码登录 web
 */
import { NextApiRequest, NextApiResponse } from "next";

import { ensureLogin, resp } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { WeappQrcodeStatus } from "@/constants";

export default async function provideWeappLoginService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);

  const { token } = req.body;
  console.log("[api/auth/wx/confirm]", user_id, token);
  if (!token) {
    return resp(10001, res);
  }

  const tokenPrepareConfirm = await prisma.verificationToken.findFirst({
    where: {
      token,
    },
  });

  if (!tokenPrepareConfirm) {
    return resp(11002, res);
  }
  if (tokenPrepareConfirm.status === WeappQrcodeStatus.Confirmed) {
    return resp(11001, res);
  }

  // websocket 通知 web 登录并写入 cookie
  // 轮询就更新字段，让 web 轮询状态，还要保存是哪个用户确认了登录操作
  await prisma.verificationToken.update({
    where: {
      token,
    },
    data: {
      status: WeappQrcodeStatus.Confirmed,
      user_id,
    },
  });

  return resp(null, res);
}
