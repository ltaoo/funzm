import { getSession } from "next-auth/client";

import prisma from "@/lib/prisma";

export default async function deleteCaptionAPI(req, res) {
  const { query } = req;
  const session = await getSession({ req });

  if (!session) {
    res.status(200).json({ code: 401, msg: "请先登录", data: null });
    return;
  }
  const { id } = query;
  console.log("[API]deleteCaptionAPI", session.user);
  // @todo 防止删除别人的字幕
  await prisma.caption.delete({
    where: { id },
    // @ts-ignore
    include: { publisher: session.user.id },
  });
  res.status(200).json({ code: 0, msg: "", data: null });
}
