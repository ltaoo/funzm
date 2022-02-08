/**
 * @file 根据 id 获取指定测验详情
 * （如果未开始时调用该接口，表示开始测验）
 */
import { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";

import {
  ExamStatus,
  PARAGRAPH_COUNT_PER_EXAM_SCENE,
} from "@/domains/exam/constants";
import prisma from "@/lib/prisma";
import { ensureLogin, resp } from "@/lib/utils";

export default async function provideExamSceneProfileService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);

  const { id: i } = req.query as { id: string };
  const id = Number(i);

  if (Number.isNaN(id)) {
    return resp(10001, res);
  }

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
    return resp(13000, res);
  }
  const { caption_id, index, start_id, status, spellings } = data;
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

  if (status === ExamStatus.Prepare) {
    const data = await prisma.examScene.update({
      where: {
        id,
      },
      data: {
        status: ExamStatus.Started,
        begin_at: dayjs().toDate(),
      },
    });
    return resp(
      {
        ...data,
        paragraphs,
      },
      res
    );
  }

  if ([ExamStatus.Completed, ExamStatus.Failed].includes(status)) {
    // 尝试获取下一关卡句子，如果已经没有数据了，就不让展示「下一关」按钮
    const paragraphCount = await prisma.paragraph.count({
      where: {
        caption_id,
        deleted: false,
      },
    });
    const maxIndex = Math.ceil(paragraphCount / PARAGRAPH_COUNT_PER_EXAM_SCENE);
    return resp(
      {
        ...data,
        paragraphs,
        no_more: index >= maxIndex,
      },
      res
    );
  }

  // 已开始的测验
  const lastOne = spellings[0];
  return resp(
    {
      ...data,
      cur: lastOne?.paragraph_id,
      paragraphs,
    },
    res
  );
}
