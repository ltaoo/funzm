/**
 * @file 新增字幕
 */
import { getSession } from "@/next-auth/client";
import jwt from "@/next-auth/lib/jwt";

import * as cookie from "@/next-auth/server/lib/cookie";
import { addCaptionService } from "@/lib/caption";

export default async function addCaption(req, res) {
  const { body } = req;
  // console.log("[API]addCaption", body, await getSession(req));
  const cookies = {
    ...cookie.defaultCookies(),
  };
  const sessionToken = req.cookies[cookies.sessionToken.name];
  // const decodedJwt = await jwt.decode({ ...jwt, token: sessionToken });
  console.log("[API]addCaption", sessionToken, jwt);
  try {
    // await addCaptionService(body);
    res.status(200).json({ code: 0, msg: "", data: null });
  } catch (err) {
    res.status(200).json({ code: 100, msg: err.message, data: null });
  }
}
