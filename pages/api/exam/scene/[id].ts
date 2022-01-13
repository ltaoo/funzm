/**
 * @file 根据 id 获取指定测验详情（结果）
 */
import { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";

import {
  CORRECT_RATE_NEEDED_FOR_COMPLETE,
  ExamStatus,
  PARAGRAPH_COUNT_PER_EXAM_SCENE,
  ScoreType,
  SpellingResultType,
} from "@/domains/exam/constants";
import prisma from "@/lib/prisma";
import { ensureLogin } from "@/lib/utils";
import { computeScoreByStats, removeZeroAtTail } from "@/domains/exam/utils";
import { addScore } from "@/lib/models/score";

export default async function provideExamSceneService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = await ensureLogin(req, res);

  const { id } = req.query as { id: string };
  const data = await prisma.examScene.findUnique({
    where: {
      id,
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
  if (data === null) {
    res.status(200).json({
      code: 130,
      msg: "测验数据不存在，请确认 id 是否正确",
      data: null,
    });
    return;
  }
  const {
    caption_id,
    start_id,
    status,
    spellings,
    created_at,
    begin_at,
    ended_at,
  } = data;

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

  const now = dayjs();
  // need update exam status
  if (ended_at && status === ExamStatus.Started) {
    let result = status;
    let score = 0;
    // completed
    if (spellings.length === paragraphs.length) {
      const correctSpellings = spellings.filter(
        (spelling) => spelling.type === SpellingResultType.Correct
      );
      const incorrectSpellings = spellings.filter(
        (spelling) => spelling.type === SpellingResultType.Incorrect
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

      score = (() => {
        // @todo 是否已经完成过同样的测验（start 相同），相同则将积分数乘以比例减少，按完成过测验的数量即使，最小 10%
        if (result === ExamStatus.Completed) {
          return computeScoreByStats({
            total: spellings.length,
            seconds: now.clone().unix() - (begin_at || created_at),
            correct: correctSpellings.length,
            incorrect: incorrectSpellings.length,
            correctRate: rate,
          });
        }
        return 0;
      })();
      if (result === ExamStatus.Completed) {
        await addScore(userId, {
          value: score,
          desc: `完成测验 ${id}`,
          type: ScoreType.Increment,
          createdAt: now.clone().unix(),
        });
      }
    }
    const updated = await prisma.examScene.update({
      where: {
        id,
      },
      data: {
        status: result,
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
    res.status(200).json({
      code: 0,
      msg: "",
      data: {
        ...updated,
        paragraphs,
      },
    });
    return;
  }

  if (status === ExamStatus.Prepare) {
    console.log('[LOG]start a prepare exam');
    const data = await prisma.examScene.update({
      where: {
        id,
      },
      data: {
        status: ExamStatus.Started,
        begin_at: dayjs().unix(),
      },
    });
    res.status(200).json({
      code: 0,
      msg: "",
      data: {
        ...data,
        paragraphs,
      },
    });
    return;
  }

  if ([ExamStatus.Completed, ExamStatus.Failed].includes(status)) {
    res.status(200).json({
      code: 0,
      msg: "",
      data: {
        ...data,
        paragraphs,
      },
    });
    return;
  }
  const lastOne = spellings[0];

  // console.log("[LOG]/api/exam/scene/[id].ts - spellings", spellings);
  res.status(200).json({
    code: 0,
    msg: "",
    data: {
      ...data,
      cur: lastOne?.paragraph_id,
      paragraphs,
    },
  });
}
