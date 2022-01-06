import { getSession } from "@/next-auth/client";

import prisma from "@/lib/prisma";

export default async function deleteCaptionAPI(req, res) {
  const { query } = req;
  const session = await getSession({ req });

  if (!session) {
    res.status(200).json({ code: 401, msg: "请先登录", data: null });
    return;
  }
  const { id } = query;
  const userId = session.user.id as string;
  console.log('[API]deleteCaptionAPI', id);
  await prisma.caption.delete({
    where: { id },
    // @ts-ignore
    include: { publisher: userId },
  });
  res.status(200).json({ code: 0, msg: "", data: null });
}
