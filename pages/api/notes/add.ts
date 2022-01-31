/**
 * @file 新增笔记
 */
import { NextApiRequest, NextApiResponse } from "next";

import { ensureLogin, resp } from "@/lib/utils";
import prisma from "@/lib/prisma";

export default async function provideNoteAddingService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);

  const { caption_id, paragraph_id, content, text, start, end } = req.body;
  // @todo 校验参数

  let ci = caption_id;

  if (caption_id === undefined) {
    const p = await prisma.paragraph.findUnique({
      where: {
        id: paragraph_id,
      },
    });
    ci = p.caption_id;
  }

  const created = await prisma.note.create({
    data: {
      user_id,
      caption_id: Number(ci),
      paragraph_id,
      content,
      text,
      start,
      end,
    },
  });

  return resp(created, res);
}
