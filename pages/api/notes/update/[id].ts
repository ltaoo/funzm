/**
 * @file 更新笔记
 */
import { NextApiRequest, NextApiResponse } from "next";

import { ensureLogin, resp } from "@/lib/utils";
import prisma from "@/lib/prisma";

export default async function provideNoteUpdateService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);

  const { id } = req.query as { id: string };
  const { content } = req.body;

  const existing = await prisma.note.findFirst({
    where: { id: Number(id), user_id },
  });

  if (!existing) {
    return resp(10003, res);
  }

  const updated = await prisma.note.update({
    where: {
      id: Number(id),
    },
    data: {
      content,
    },
  });

  return resp(updated, res);
}
