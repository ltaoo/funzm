/**
 * @file 删除句子
 */
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { ensureLogin } from "@/lib/utils";
export default async function provideParagraphDeletingService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = await ensureLogin(req, res);
  const { query } = req;
  const { id } = query as { id: string };

  const theParagraphPrepareDeleted = await prisma.paragraph.findUnique({
    where: { id },
  });
  if (!theParagraphPrepareDeleted) {
    res.status(200).json({ code: 100, msg: "句子不存在", data: null });
    return;
  }
  const owner = await prisma.caption.findUnique({
    where: {
      id: theParagraphPrepareDeleted.caption_id,
    },
  });
  if (!owner) {
    res.status(200).json({ code: 100, msg: "句子不存在", data: null });
    return;
  }
  if (owner.publisher_id !== userId) {
    res.status(200).json({ code: 100, msg: "操作失败", data: null });
    return;
  }

  await prisma.paragraph.update({
    where: {
      id,
    },
    data: {
      deleted: true,
    },
  });

  res.status(200).json({ code: 0, msg: "", data: null });
}
