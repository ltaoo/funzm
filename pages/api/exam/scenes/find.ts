/**
 * @file 根据字幕 id 获取所有测验场景
 */
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { ensureLogin, resp } from "@/lib/utils";
import { ExamStatus } from "@/domains/exam/constants";

export default async function provideExamScenesService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);
  const { id: i, status } = req.query as { id: string; status: string };

  const id = Number(i);

  if (Number.isNaN(id) || typeof id !== "number") {
    resp(1001, res);
  }

  const data = await prisma.examScene.findMany({
    where: {
      user_id,
      caption_id: id,
      status: {
        in: status ? Number(status) : [ExamStatus.Completed, ExamStatus.Failed],
      },
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      start: true,
    },
  });
  res.status(200).json({
    code: 0,
    msg: "",
    data,
  });
}
