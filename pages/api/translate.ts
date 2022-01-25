import { NextApiRequest, NextApiResponse } from "next";

import { translate } from "@/lib/utils/youdao";
import { ensureLogin } from "@/lib/utils";

export default async function provideTranslateService(req: NextApiRequest, res: NextApiResponse) {
  await ensureLogin(req, res)

  const { word } = req.query;
  if (!word) {
    res.status(200).json({
      code: 130,
      msg: "请传入要翻译的单测",
      data: null,
    });
    return;
  }

  try {
    const data = await translate(word);
    res.status(200).json({
      code: 0,
      msg: "",
      data,
    });
  } catch (err) {
    res.status(200).json({
      code: 120,
      msg: err.message,
      data: null,
    });
  }
}
