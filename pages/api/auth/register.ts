/**
 * @file 新用户注册
 * POST `/api/user/register`
 */
import { NextApiRequest, NextApiResponse } from "next";
import Joi from "joi";
import { serialize } from "cookie";

import { encode } from "@/next-auth/jwt";
import * as User from "@/lib/models/user";
import prisma from "@/lib/prisma";
import { resp } from "@/lib/utils";
import { DEFAULT_MAX_AGE, TOKEN_NAME } from "@/next-auth/constants";

export default async function provideUserRegisterService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password } = req.body;

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$"))
      .required(),
  });

  try {
    await schema.validateAsync({ email, password });

    const existing = await prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      return resp(403, res);
    }

    const user = await User.addUser({ email, password });
    if (!user) {
      return resp(404, res);
    }
    const token = await encode({
      token: {
        id: user.id,
      },
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
    resp(null, res);
  } catch (err) {
    return resp(10000, res, err.message);
  }
}
