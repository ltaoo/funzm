/**
 * @file 测验进度
 */
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { ensureLogin, resp } from "@/lib/utils";
import { ExamStatus } from "@/domains/exam/constants";

export default async function provideExamProgressService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);

  const { caption_id: i } = req.query as { caption_id: string };
  const caption_id = Number(i);

  if (Number.isNaN(caption_id) || typeof caption_id !== "number") {
    return resp(10001, res);
  }

  const examScenes = await prisma.examScene.findMany({
    where: {
      user_id,
      caption_id,
    },
    include: {
      start: true,
    },
    orderBy: {
      index: "desc",
    },
  });

  if (examScenes.length === 0) {
    return resp([], res);
  }

  const result = {};
  for (let i = 0; i < examScenes.length; i += 1) {
    const es = examScenes[i];

    const { id, index, start, score, status } = es;

    result[index] = result[index] || {
      id,
      scene_id: id,
      count: 0,
      score,
      start,
      completed: false,
    };
    result[index].count += 1;
    if (score > 0) {
      // 是否百分比正确率过
      result[index].prefect = true;
    }
    if (status === ExamStatus.Completed) {
      result[index].completed = true;
    }
  }

  return resp(
    Object.keys(result).map((index) => {
      return {
        index: Number(index),
        ...result[index],
      };
    }),
    res
  );
}
