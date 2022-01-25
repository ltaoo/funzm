/**
 * @file 使用 wx.login 返回的 code 注册登录？
 */
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

import { encode } from "@/next-auth/jwt";
import { resp } from "@/lib/utils";
import { WEAPP_ID, WEAPP_SECRET } from "@/lib/wx/token";
import prisma from "@/lib/prisma";
import dayjs from "dayjs";
import { SubscriptionStatus } from "@prisma/client";

export default async function provideWeappLoginService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code, nickname, avatar } = req.body;

  // https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${WEAPP_ID}&secret=${WEAPP_SECRET}&js_code=${code}&grant_type=authorization_code`;
  const {
    data: { openid, session_key, unionid, errcode, errmsg },
  } = await axios.get(url);

  console.log(
    "[WX]LOGIN - resp: ",
    openid,
    session_key,
    unionid,
    errcode,
    errmsg
  );

  if (errcode && errcode !== 0) {
    return resp(10000, res, errmsg);
  }

  const existing = await prisma.account.findFirst({
    where: {
      provider_account_id: openid,
    },
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

  if (existing) {
    const payload = {
      id: existing.user_id,
      nickname,
      avatar,
    };
    const token = await encode({
      token: payload,
      secret: process.env.SECRET,
    });
    return resp(
      {
        token,
        nickname,
        avatar,
      },
      res
    );
  }

  const { id } = await prisma.user.create({
    data: {
      profile: {
        create: {
          nickname,
          avatar,
        },
      },
    },
  });
  await prisma.account.create({
    data: {
      user_id: id,
      type: "oauth",
      provider: "weapp",
      provider_account_id: openid,
    },
  });

  const payload = {
    id,
    nickname,
    avatar,
  };
  const token = await encode({
    token: payload,
    secret: process.env.SECRET,
  });
  return resp(
    {
      token,
      nickname,
      avatar,
    },
    res
  );
}
