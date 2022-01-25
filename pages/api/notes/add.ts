import { NextApiRequest, NextApiResponse } from "next";
import { escape } from "querystring";

import { ensureLogin, resp } from "@/lib/utils";
import prisma from "@/lib/prisma";

export default async function provideNoteAddingService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);

  const { caption_id, paragraph_id, content, text, start, end } = req.body;
  // @todo 校验参数

  const created = await prisma.note.create({
    data: {
      user_id,
      caption_id: Number(caption_id),
      paragraph_id,
      content,
      text,
      start,
      end,
    },
  });

  return resp(created, res);
}
