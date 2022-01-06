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
  const userId = await ensureLogin(req, res);
  const { id, status } = req.body;

  const data = await prisma.examScene.findUnique({
    where: {
      id,
    },
    include: {
      spellings: true,
    },
  });

  const { spellings, created_at } = data;
  const correctSpellings = spellings.filter(
    (spelling) => spelling.type === SpellingResultType.Correct
  );
  const incorrectSpellings = spellings.filter(
    (spelling) => spelling.type === SpellingResultType.Incorrect
  );

  const now = dayjs();

  const score = (() => {
    // @todo 是否已经完成过同样的测验（start 相同），相同则将积分数乘以比例减少，按完成过测验的数量即使，最小 10%
    if (status === ExamStatus.Completed) {
      return computeScoreByStats({
        total: spellings.length,
        seconds: now.clone().unix() - created_at,
        correct: correctSpellings.length,
        incorrect: incorrectSpellings.length,
        correctRate: (correctSpellings.length / spellings.length) * 100,
      });
    }
    return 0;
  })();

  const ended_at = [ExamStatus.Completed, ExamStatus.Failed].includes(status)
    ? now.clone().unix()
    : null;
  // const nowText = now.clone().format("YYYY-MM-DD HH:mm:ss");
  console.log("[LOG]/api/exam/scene/update.ts - data", {
    status,
    score,
    end_at: ended_at,
  });

  await addScore(userId, {
    value: score,
    desc: `完成测验 ${id}`,
    type: ScoreType.Increment,
    createdAt: now.clone().unix(),
  });

  await prisma.examScene.update({
    where: {
      id,
    },
    data: {
      status,
      score,
      ended_at,
    },
  });
  res.status(200).json({ code: 0, msg: "", data: null });
}
