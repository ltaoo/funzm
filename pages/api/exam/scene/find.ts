/**
 * @file 获取当前未开始/已开始的测验
 */
import { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";

import prisma from "@/lib/prisma";
import { ensureLogin } from "@/lib/utils";
import {
  ExamStatus,
  PARAGRAPH_COUNT_PER_EXAM_SCENE,
} from "@/domains/exam/constants";

export default async function provideCurExamSceneService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('[LOG]provideCurExamSceneService');
  const userId = await ensureLogin(req, res);

  const { captionId } = req.query as { captionId: string };
  const initialized = await prisma.examScene.findFirst({
    where: {
      caption_id: captionId,
    },
  });
  console.log('[LOG]provideCurExamSceneService - check has initialize', initialized);
  if (!initialized) {
    const firstParagraph = await prisma.paragraph.findFirst({
      where: {
        caption_id: captionId,
        deleted: false,
      },
    });
    const created = await prisma.examScene.create({
      data: {
        user_id: userId,
        caption_id: captionId,
        start_id: firstParagraph.id,
        created_at: dayjs().unix(),
      },
    });
    res.status(200).json({ code: 0, msg: "", data: created });
    return;
  }
  const { status, start_id } = initialized;
  if ([ExamStatus.Prepare, ExamStatus.Started].includes(status)) {
    res.status(200).json({ code: 0, msg: "", data: initialized });
    return;
  }
  if ([ExamStatus.Failed].includes(status)) {
    const data = await prisma.examScene.create({
      data: {
        caption_id: captionId,
        user_id: userId,
        start_id,
        created_at: dayjs().unix(),
      },
    });
    res.status(200).json({ code: 0, msg: "", data });
    return;
  }
  // create a new exam scene
  const response = await prisma.paragraph.findMany({
    where: {
      caption_id: captionId,
      deleted: false,
    },
    cursor: {
      id: start_id,
    },
    skip: 1,
    take: PARAGRAPH_COUNT_PER_EXAM_SCENE,
  });
  console.log('[LOG]search paragraph for create a new scene', start_id, response[response.length - 1]);
  // console.log("[API]provideCurExamScene - next paragraphs", response);
  const remainingParagraphs = response;
  if (remainingParagraphs.length === 0) {
    res.status(200).json({ code: 0, msg: "", data: { id: null } });
    return;
  }
  const createdNewExamScene = await prisma.examScene.create({
    data: {
      caption_id: captionId,
      user_id: userId,
      start_id: response[response.length - 1].id,
      created_at: dayjs().unix(),
    },
  });
  res.status(200).json({ code: 0, msg: "", data: createdNewExamScene });
}
