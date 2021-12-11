/**
 * @file 新增测验拼写记录
 */
import prisma from "@/lib/prisma";
import { getSession } from "@/next-auth/client";

import * as utils from "@/lib/utils";
// import { SpellingResultType } from "@/domains/exam/constants";

export default async function addExamSpellingErrorAPI(req, res) {
  const session = await getSession({ req });
  if (!session) {
    res.status(200).json({
      code: 401,
      msg: "请先登录",
      data: null,
    });
    return;
  }
  const {
    body: { paragraphId, examId, input, type },
  } = req;
  try {
    const {
      // @ts-ignore
      user: { id: userId },
    } = session;
    const existing = await prisma.spellingResult.findFirst({
      where: {
        paragraphId,
        examId,
      },
    });
    if (existing) {
      // 这种属于异常情况，当拼接记录请求成功，但更新测验当前段落没有成功，会导致用户重复拼写同一个句子，就会出现重复记录
      res.status(200).json({ code: 100, msg: "Existing", data: null });
      return;
    }
    const { id } = await prisma.spellingResult.create({
      data: {
        userId,
        paragraphId,
        examId,
        type,
        input,
        created_at: utils.seconds(),
      },
    });
    res.status(200).json({ code: 0, msg: "", data: { id } });
  } catch (err) {
    res.status(200).json({ code: 100, msg: err.message, data: null });
  }
}
