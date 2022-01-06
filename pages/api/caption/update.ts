/**
 * @file 编辑字幕
 */
import { getSession } from "@/next-auth/client";
import prisma from "@/lib/prisma";

export default async function provideCaptionEditingService(req, res) {
  const { body } = req;
  const session = await getSession({ req });

  if (!session) {
    res.status(200).json({ code: 401, msg: "请先登录", data: null });
    return;
  }

  // const userId = session.user?.id as string;

  const { id, title } = body;
  await prisma.caption.update({
    where: { id },
    data: {
      title,
    },
  });
  res.status(200).json({ code: 0, msg: "", data: null });
}
