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
  const token = await getToken({ req, cookieName: "weapp-token" });

  if (!token) {
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
      token: token.token,
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
    const defaultToken = {
      id: existing.user_id,
      nickname: profile.nickname,
      avatar: profile.avatar,
    };
    // console.log('[]before encode', defaultToken)
    const token = await encode({
      token: defaultToken,
      secret: process.env.SECRET,
    });

    const cookie = serialize(TOKEN_NAME, token, {
      maxAge: DEFAULT_MAX_AGE,
      expires: new Date(Date.now() + DEFAULT_MAX_AGE * 1000),
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
    });

    res.setHeader("Set-Cookie", cookie);
  }

  return resp(
    {
      status: existing.status,
    },
    res
  );
}
