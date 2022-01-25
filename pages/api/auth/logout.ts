import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

import { ensureLogin, resp } from "@/lib/utils";
import { TOKEN_NAME } from "@/next-auth/constants";

export default async function provideLogoutService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await ensureLogin(req, res);

  const cookie = serialize(TOKEN_NAME, "", {
    maxAge: -1,
    path: "/",
  });

  res.setHeader("Set-Cookie", cookie);

  resp(null, res);
}
