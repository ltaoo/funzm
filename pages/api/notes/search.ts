/**
 * @file 获取笔记列表(不分页)
 */
import { NextApiRequest, NextApiResponse } from "next";

import { ensureLogin, resp } from "@/lib/utils";
import prisma from "@/lib/prisma";

export default async function provideNoteSearchingService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);

  const { caption_id } = req.query as {
    caption_id?: number;
    paragraph_ids?: number[];
  };
  const { paragraph_ids } = req.body;

  if (caption_id !== undefined) {
    const notes = await prisma.note.findMany({
      where: {
        // 特意不查当前用户的，是为了当字幕被分享，也要能看到对应的笔记
        // 但这个笔记并不是当前用户写的
        // user_id,
        caption_id: Number(caption_id),
      },
    });

    return resp(notes, res);
  }

  if (paragraph_ids !== undefined) {
    const notes = await prisma.note.findMany({
      where: {
        // user_id,
        paragraph_id: {
          in: paragraph_ids,
        },
      },
    });

    return resp(notes, res);
  }

  return resp(10006, res);
}
