/**
 * @file 更新测验场景
 */
import { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";

import { addScore } from "@/lib/models/score";
import { ensureLogin } from "@/lib/utils";
import prisma from "@/lib/prisma";
import {
  ExamStatus,
  ScoreType,
  SpellingResultType,
} from "@/domains/exam/constants";
import { computeScoreByStats } from "@/domains/exam/utils";

export default async function provideUpdateExamSceneService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await ensureLogin(req, res);
  const { id, status } = req.body;

  const data = await prisma.examScene.findUnique({
    where: {
      id,
    },
    include: {
      spellings: true,
    },
  });

  const now = dayjs();

  const ended_at = now.clone().unix();

  // if (status === ExamStatus.Completed) {
  //   await addScore(userId, {
  //     value: score,
  //     desc: `完成测验 ${id}`,
  //     type: ScoreType.Increment,
  //     createdAt: now.clone().unix(),
  //   });
  // }

  await prisma.examScene.update({
    where: {
      id,
    },
    data: {
      ended_at,
    },
  });
  res.status(200).json({ code: 0, msg: "", data: null });
}
