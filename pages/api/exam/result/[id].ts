/**
 * @file 获取测验结果
 */
import prisma from "@/lib/prisma";
import { getSession } from "@/next-auth/client";

export default async function fetchExamResultAPI(req, res) {
  const session = await getSession({ req });
  if (!session) {
    res.status(200).json({ code: 401, msg: "请先登录", data: null });
    return;
  }
  const {
    query: { id, type, includeParagraph },
  } = req;
  // @ts-ignore
  const {
    user: { id: userId },
  } = session;
  // console.log('[]fetchExamResultAPI', type, id, userId, body);
  try {
    const dataSources = await prisma.spellingResult.findMany({
      where: {
        userId,
        type: type ? Number(type) : undefined,
      },
      include: {
        paragraph: Number(includeParagraph) === 1,
      },
    });
    res.status(200).json({ code: 0, msg: "", data: dataSources });
  } catch (err) {
    res.status(200).json({ code: 500, msg: err.message, data: null });
  }
}
