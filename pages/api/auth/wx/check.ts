/**
 * @file 查询小程序扫码登录状态
 */
import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

import prisma from "@/lib/prisma";
import { resp } from "@/lib/utils";
import { WeappQrcodeStatus } from "@/constants";
import { encode, getToken } from "@/next-auth/jwt";
import { DEFAULT_MAX_AGE, TOKEN_NAME } from "@/next-auth/constants";

export default async function provideWeappQrcodeStatusCheckService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const t = await getToken({ req, cookieName: "weapp-token" });

  if (!t) {
    resp(
      {
        status: WeappQrcodeStatus.Expired,
      },
      res
    );
    return;
  }

  const existing = await prisma.verificationToken.findFirst({
    where: {
      token: t.token,
    },
  });

  if (!existing) {
    return resp(10001, res);
  }

  if (existing.status === WeappQrcodeStatus.Confirmed) {
    const profile = await prisma.profile.findUnique({
      where: {
        user_id: existing.user_id,
      },
    });
    await prisma.verificationToken.delete({
      where: {
        token: t.token as string,
      },
    });
    const defaultToken = {
      id: existing.user_id,
      nickname: profile.nickname,
      avatar: profile.avatar,
    };
    const token = await encode({
      token: defaultToken,
      secret: process.env.SECRET,
    });

    const userCookie = serialize(TOKEN_NAME, token, {
      maxAge: DEFAULT_MAX_AGE,
      expires: new Date(Date.now() + DEFAULT_MAX_AGE * 1000),
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
    });
    const cookie = serialize("weapp-token", "", {
      maxAge: -1,
      path: "/",
    });
    res.setHeader("Set-Cookie", [userCookie, cookie]);
  }

  return resp(
    {
      status: existing.status,
    },
    res
  );
}
