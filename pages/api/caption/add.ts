/**
 * @file 新增字幕
 */
import { getSession } from "@/next-auth/client";

import { addCaptionService } from "@/lib/caption";

export default async function addCaption(req, res) {
  const { body } = req;
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
    const {
      // @ts-ignore
      user: { id: publisherId },
    } = session;
    const { id } = await addCaptionService({
      publisherId,
      ...body,
    });
    res.status(200).json({ code: 0, msg: "", data: { id } });
  } catch (err) {
    res.status(200).json({ code: 100, msg: err.message, data: null });
  }
}
