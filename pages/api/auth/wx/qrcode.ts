/**
 * @file 生成小程序登录二维码
 */
import { randomBytes } from "crypto";

import { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";
import { serialize } from "cookie";

import { encode, getToken } from "@/next-auth/jwt";
import prisma from "@/lib/prisma";
import { resp } from "@/lib/utils";
import { generateWeappQrcode } from "@/lib/wx/unlimite";

export default async function provideWeappQrcodeGenerateService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const existingToken = await getToken({
    req,
    cookieName: "weapp-token",
  });

  // console.log("[api/auth/wx/qrcode]existingToken", existingToken);
  if (existingToken) {
    const image = await generateWeappQrcode({
      scene: existingToken.token,
      page: "pages/confirm/index",
    });
    return resp({ image }, res);
  }
  const randomToken = randomBytes(16).toString("hex");

  const expiresMinutes = 3;
  const expires = dayjs().add(expiresMinutes, "minutes");
  const { token } = await prisma.verificationToken.create({
    data: {
      identifier: "",
      token: randomToken,
      expires: expires.toDate(),
    },
  });

  const image = await generateWeappQrcode({
    scene: token,
    page: "pages/confirm/index",
  });

  // console.log("[api/auth/wx/qrcode] - generated weapp qrcode", token, image);

  const result = await encode({
    token: {
      token,
    },
    secret: process.env.SECRET,
  });
  const cookie = serialize("weapp-token", result, {
    maxAge: expiresMinutes * 60,
    expires: expires.toDate(),
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax",
  });

  res.setHeader("Set-Cookie", cookie);
  return resp(
    {
      image,
      token,
    },
    res
  );
}
