/**
 * @file 更新测验关卡
 */
import { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";

import { ensureLogin, resp } from "@/lib/utils";
import prisma from "@/lib/prisma";
import {
  CORRECT_RATE_NEEDED_FOR_COMPLETE,
  ExamStatus,
  PARAGRAPH_COUNT_PER_EXAM_SCENE,
  ScoreType,
  SpellingResultType,
} from "@/domains/exam/constants";
import { removeZeroAtTail } from "@/domains/exam/utils";
import { addScore } from "@/lib/models/score";

export default async function provideUpdateExamSceneService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);
  const { id: i } = req.body;

  const id = Number(i);
  if (Number.isNaN(id)) {
    return resp(10001, res);
  }

  const data = await prisma.examScene.findFirst({
    where: {
      id,
    },
    include: {
      spellings: true,
    },
  });

  if (!data) {
    return resp(10003, res);
  }

  const { caption_id, start_id, index, status, spellings } = data;
  if ([ExamStatus.Completed, ExamStatus.Failed].includes(status)) {
    return resp(13002, res);
  }

  const now = dayjs();
  const ended_at = now.clone().toDate();

  const paragraphs = await prisma.paragraph.findMany({
    where: {
      caption_id,
      deleted: false,
    },
    cursor: {
      id: start_id,
    },
    take: PARAGRAPH_COUNT_PER_EXAM_SCENE,
  });
  // need update exam status
  let result = status;
  let score = 0;
  // completed
  if (spellings.length === paragraphs.length) {
    const correctSpellings = spellings.filter(
      (spelling) => spelling.type === SpellingResultType.Correct
    );
    const rate = parseFloat(
      removeZeroAtTail(
        ((correctSpellings.length / spellings.length) * 100).toFixed(2)
      )
    );
    result = (() => {
      if (rate >= CORRECT_RATE_NEEDED_FOR_COMPLETE) {
        return ExamStatus.Completed;
      }
      return ExamStatus.Failed;
    })();

    score = await (async () => {
      if (result === ExamStatus.Completed && rate === 100) {
        const hasAddScore = await prisma.examScene.findFirst({
          where: {
            user_id,
            caption_id,
            index,
            NOT: {
              id,
              score: 0,
            },
          },
        });
        if (hasAddScore) {
          return 0;
        }
        return Math.floor(Math.random() * 10);
      }
      return 0;
    })();

    if (score > 0) {
      await addScore(user_id, {
        value: score,
        desc: "正确率 100% 完成测验",
        type: ScoreType.Increment,
      });
    }
  } else {
    result = ExamStatus.Failed;
  }
  const updated = await prisma.examScene.update({
    where: {
      id,
    },
    data: {
      status: result,
      ended_at,
      score,
    },
    include: {
      spellings: {
        orderBy: {
          created_at: "desc",
        },
        include: {
          paragraph: true,
        },
      },
    },
  });

  return resp(
    {
      ...updated,
      paragraphs,
      need_show_score_tip: updated.score !== 0,
    },
    res
  );
}
