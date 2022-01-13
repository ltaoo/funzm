/**
 * @file 根据 id 获取指定字幕
 */
import { NextApiRequest, NextApiResponse } from "next";

import { ensureLogin } from "@/lib/utils";
import prisma from "@/lib/prisma";

export default async function provideFetchCaptionService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await ensureLogin(req, res);
  const { query } = req;
  const { id } = query as { id: string; paragraph?: string };

  const [paragraphCount, data] = await prisma.$transaction(
    [
      prisma.paragraph.count({
        where: {
          caption_id: id,
        },
      }),
      prisma.caption.findUnique({
        where: {
          id,
        },
      }),
    ].filter(Boolean)
  );

  if (data === null) {
    res.status(200).json({ code: 130, msg: "id 不存在", data: null });
    return;
  }
  res.status(200).json({ code: 0, msg: "", data });
}
