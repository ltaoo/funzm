/**
 * @file 新增场景测验
 */
import { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";

import { ensureLogin } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { ExamStatus } from "@/domains/exam/constants";

export default async function provideExamSceneAddingService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = await ensureLogin(req, res);
  const { body } = req;
  const { captionId, start } = body as { captionId: string; start: string };

  const existing = await prisma.examScene.findFirst({
    where: {
      status: { in: [ExamStatus.Prepare, ExamStatus.Started] },
    },
  });
  if (existing) {
    res
      .status(200)
      .json({ code: 0, msg: "已经存在进行中的测验", data: existing });
  }
  const now = dayjs();
  // console.log("[API]examScene create", examId);
  const { id } = await prisma.examScene.create({
    data: {
      user_id: userId,
      caption_id: captionId,
      start_id: start,
      created_at: now.unix(),
      // begin_at: now.unix(),
    },
  });
  res.status(200).json({ code: 0, msg: "", data: { id } });
}
