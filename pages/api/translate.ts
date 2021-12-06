import { getSession } from "@/next-auth/client";

import { translate } from "@/lib/utils/youdao";

export default async function translateWord(req, res) {
  const session = await getSession({ req });
  if (!session) {
    res.status(200).json({
      code: 401,
      msg: "请先登录",
      data: null,
    });
    return;
  }
  const { query } = req;
  if (!query.word) {
    res.status(200).json({
      code: 130,
      msg: "请传入要翻译的单测",
      data: null,
    });
    return;
  }

  try {
    const data = await translate(query.word);
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
