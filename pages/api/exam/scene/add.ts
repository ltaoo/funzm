/**
 * @file 新增场景测验
 */
import { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";

import { ensureLogin } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { ExamStatus } from "@/domains/exam/constants";

export default async function provideExamScene(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await ensureLogin(req, res);
  const { body } = req;
  const { captionId, examId, start } = body;

  const existing = await prisma.examScene.findFirst({
    where: {
      examId,
      status: { in: [ExamStatus.Prepare, ExamStatus.Started] },
    },
  });
  if (existing) {
    res
      .status(200)
      .json({ code: 0, msg: "已经存在进行中的测验", data: existing });
  }
  // console.log("[API]examScene create", examId);
  const { id } = await prisma.examScene.create({
    data: {
      captionId,
      examId,
      start,
      created_at: dayjs().unix(),
    },
  });
  res.status(200).json({ code: 0, msg: "", data: { id } });
}
