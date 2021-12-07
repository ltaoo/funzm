/**
 * @file 根据 id 获取指定字幕
 */
import { getSession } from "@/next-auth/client";

import { fetchCaptionById } from "@/lib/caption";

export default async function addCaption(req, res) {
  const { query } = req;
  const session = await getSession({ req });
  if (!session) {
    res.status(200).json({
      code: 401,
      msg: "Please complete authorize before save caption",
      data: null,
    });
    return;
  }
  try {
    const { id, paragraph } = query as { id: string; paragraph?: string };
    const data = await fetchCaptionById({
      id,
      paragraph: paragraph === "1",
    });
    if (data === null) {
      res.status(200).json({ code: 130, msg: "Not Existing", data: null });
      return;
    }
    res.status(200).json({ code: 0, msg: "", data });
  } catch (err) {
    res.status(200).json({ code: 100, msg: err.message, data: null });
  }
}
