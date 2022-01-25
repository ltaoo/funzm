/**
 * @file 恢复删除的句子
 * @todo （可以复用 delete.ts）
 */
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { ensureLogin } from "@/lib/utils";
export default async function provideParagraphDeletingService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);
  const { id: i } = req.query as { id: string };

  const id = Number(i);

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
  if (owner.user_id !== user_id) {
    res.status(200).json({ code: 100, msg: "操作失败", data: null });
    return;
  }

  await prisma.paragraph.update({
    where: {
      id,
    },
    data: {
      deleted: false,
    },
  });

  res.status(200).json({ code: 0, msg: "", data: null });
}
