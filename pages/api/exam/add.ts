/**
 * @file 新增测验
 */
import prisma from "@/lib/prisma";
import { getSession } from "@/next-auth/client";

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
  const {
    captionId,
    curParagraphId,
    skippedParagraphs,
    correctParagraphs,
    incorrectParagraphs,
    combo,
    maxCombo,
  } = body;
  try {
    const {
      // @ts-ignore
      user: { id: userId },
    } = session;
    console.log(prisma.exam);
    const { id } = await prisma.exam.create({
      data: {
        captionId,
        userId,
        curParagraphId,
        combo,
        maxCombo,
        skippedParagraphIds: skippedParagraphs.map((p) => p.id).join(','),
        correctParagraphIds: correctParagraphs.map((p) => p.id).join(','),
        incorrectParagraphIds: incorrectParagraphs.map((p) => p.id).join(','),
      },
    });
    res.status(200).json({ code: 0, msg: "", data: { id } });
  } catch (err) {
    res.status(200).json({ code: 100, msg: err.message, data: null });
  }
}
