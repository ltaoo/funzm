/**
 * @file 新增测验拼写错误记录
 */
import prisma from "@/lib/prisma";
import { getSession } from "@/next-auth/client";

import * as utils from "@/lib/utils";
import { SpellingResultType } from "@/domains/exam/constants";

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
  const { body } = req;
  const { paragraphId, examId, input } = body;
  try {
    const {
      // @ts-ignore
      user: { id: userId },
    } = session;
    console.log(prisma.exam);
    const { id } = await prisma.spellingResult.create({
      data: {
        userId,
        type: SpellingResultType.Incorrect,
        input,
        paragraphId,
        examId,
        created_at: utils.seconds(),
      },
    });
    res.status(200).json({ code: 0, msg: "", data: { id } });
  } catch (err) {
    res.status(200).json({ code: 100, msg: err.message, data: null });
  }
}
