/**
 * @file 根据 id 获取指定字幕
 */
import prisma from "@/lib/prisma";
import { getSession } from "@/next-auth/client";

export default async function findExamAPI(req, res) {
  const session = await getSession({ req });
  if (!session) {
    res.status(200).json({
      code: 401,
      msg: "请先登录",
      data: null,
    });
    return;
  }
  const { query } = req;
  try {
    const { id } = query as { id: string };
    const data = await prisma.exam.findUnique({
      where: {
        id,
      },
    });
    if (data === null) {
      res.status(200).json({ code: 130, msg: "Not Existing", data: null });
      return;
    }
    res.status(200).json({ code: 0, msg: "", data });
  } catch (err) {
    res.status(200).json({ code: 100, msg: err.message, data: null });
  }
}
