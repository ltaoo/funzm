import { getSession } from "next-auth/client";

import prisma from "@/lib/prisma";

export default async function editCaptionAPI(req, res) {
  const { query } = req;
  const session = await getSession({ req });

  if (!session) {
    res.status(200).json({ code: 401, msg: "请先登录", data: null });
    return;
  }
  const { id, type, title, text1, text2 } = query;
  if (type === 1) {
    await prisma.paragraph.update({
      where: { id },
      data: {
        text1,
        text2,
      },
    });
    res.status(200).json({ code: 0, msg: "", data: null });
    return;
  }
  if (type === 2 && title) {
    await prisma.caption.update({
      where: { id },
      data: {
        title,
      },
    });
    res.status(200).json({ code: 0, msg: "", data: null });
    return;
  }
  res.status(200).json({ code: 110, msg: "未识别的操作", data: null });
}
