/**
 * @file 根据 id 获取指定字幕
 */
import { NextApiRequest, NextApiResponse } from "next";

import { ensureLogin, resp } from "@/lib/utils";
import prisma from "@/lib/prisma";

export default async function provideFetchCaptionService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await ensureLogin(req, res);
  const { id: i } = req.query as { id: string; paragraph?: string };

  const caption_id = Number(i);

  if (Number.isNaN(caption_id)) {
    return resp(10001, res);
  }

  const [paragraphCount, data] = await prisma.$transaction(
    [
      prisma.paragraph.count({
        where: {
          caption_id,
        },
      }),
      prisma.caption.findUnique({
        where: {
          id: caption_id,
        },
      }),
    ].filter(Boolean)
  );

  if (data === null) {
    return resp(300, res);
  }
  resp(
    {
      ...(data as any),
      count: paragraphCount,
    },
    res
  );
}
