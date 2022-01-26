/**
 * @file 根据 id 获取字幕详情
 */
import { NextApiRequest, NextApiResponse } from "next";

import { ensureLogin, resp } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { Caption } from "@prisma/client";

export default async function provideFetchCaptionService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);
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
      prisma.caption.findFirst({
        where: {
          id: caption_id,
          // user_id,
        },
      }),
    ].filter(Boolean)
  );

  if (data === null) {
    return resp(300, res);
  }

  const caption = data as Caption;
  // if (caption.public === false && caption.user_id !== user_id) {
  //   return resp(12001, res);
  // }
  return resp(
    {
      ...caption,
      count: paragraphCount,
      is_owner: caption.user_id === user_id,
    },
    res
  );
}
