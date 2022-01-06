import { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "@/next-auth/client";
import prisma from "@/lib/prisma";

/**
 * @file 删除句子
 */
export default async function provideParagraphDeletingService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) {
    return;
  }
  const userId = session.user?.id as string;
  const { query } = req;
  const id = query.id as string;

  const theParagraphPrepareDeleted = await prisma.paragraph.findUnique({
    where: { id },
  });
  if (!theParagraphPrepareDeleted) {
    res.status(200).json({ code: 100, msg: "要删除的句子不存在", data: null });
    return;
  }
  const owner = await prisma.caption.findUnique({
    where: {
      id: theParagraphPrepareDeleted.captionId,
    },
  });
  if (!owner) {
    res.status(200).json({ code: 100, msg: "要删除的句子不存在", data: null });
    return;
  }
  if (owner.publisherId !== userId) {
    res.status(200).json({ code: 100, msg: "不能删除别人的句子", data: null });
    return;
  }

  await prisma.paragraph.delete({
    where: {
      id,
    },
  });

  res.status(200).json({ code: 0, msg: "", data: null });
}
