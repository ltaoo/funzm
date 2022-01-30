import { NextApiRequest, NextApiResponse } from "next";

import { translate } from "@/lib/utils/baidu";
import { ensureLogin, resp } from "@/lib/utils";

export default async function provideTranslateService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await ensureLogin(req, res);

  const { word } = req.query;
  if (!word) {
    return resp(14000, res);
  }

  const data = await translate(word);
  resp(data, res);
}
