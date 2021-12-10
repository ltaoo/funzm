/**
 * @file 新增测验
 */
import { getSession } from "@/next-auth/client";
import prisma from "@/lib/prisma";
import * as utils from "@/lib/utils";

export default async function addExamAPI(req, res) {
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
  const { captionId, curParagraphId, combo, maxCombo } = body;
  try {
    const {
      // @ts-ignore
      user: { id: userId },
    } = session;
    console.log(prisma.exam);
    const { id } = await prisma.exam.create({
      data: {
        captionId: captionId,
        userId: userId,
        curParagraphId,
        combo,
        maxCombo,
        created_at: utils.seconds(),
        last_updated: null,
      },
    });
    res.status(200).json({ code: 0, msg: "", data: { id } });
  } catch (err) {
    res.status(200).json({ code: 100, msg: err.message, data: null });
  }
}
