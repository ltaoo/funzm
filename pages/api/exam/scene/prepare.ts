/**
 * @file 获取预备测验的内容
 */
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { ensureLogin, resp } from "@/lib/utils";
import {
  ExamStatus,
  PARAGRAPH_COUNT_PER_EXAM_SCENE,
} from "@/domains/exam/constants";

export default async function providePreparedExamService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);

  const { caption_id: c } = req.query as { caption_id: string };
  const caption_id = Number(c);

  // console.log("[LOG]/api/exam/scene/prepare", req.query);

  if (Number.isNaN(caption_id)) {
    return resp(10001, res);
  }

  const existing = await prisma.examScene.findFirst({
    where: {
      user_id,
      caption_id,
    },
    include: {
      start: true,
    },
    orderBy: [
      {
        index: "desc",
      },
      {
        created_at: "desc",
      },
    ],
  });
  // 指定的字幕第一次获取预备测验内容
  if (!existing) {
    const paragraphs = await prisma.paragraph.findMany({
      where: {
        caption_id,
        deleted: false,
      },
      take: PARAGRAPH_COUNT_PER_EXAM_SCENE,
    });
    const fakeCreated = {
      caption_id,
      status: ExamStatus.Prepare,
      start: paragraphs[0],
      start_id: paragraphs[0].id,
      index: 1,
      paragraphs,
    };
    return resp(fakeCreated, res);
  }

  const { index, status, start, start_id } = existing;
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
  // 还在测验
  if ([ExamStatus.Prepare, ExamStatus.Started].includes(status)) {
    return resp(
      {
        ...existing,
        paragraphs,
      },
      res
    );
  }
  // 需要重来
  if ([ExamStatus.Failed].includes(status)) {
    const fakeCreated = {
      caption_id,
      start,
      start_id,
      status: ExamStatus.Prepare,
      paragraphs,
      index,
    };
    return resp(fakeCreated, res);
  }
  // 最大关卡是已完成，就准备下一个
  const nextParagraphs = await prisma.paragraph.findMany({
    where: {
      caption_id: caption_id,
      deleted: false,
    },
    cursor: {
      id: start_id,
    },
    skip: PARAGRAPH_COUNT_PER_EXAM_SCENE,
    take: PARAGRAPH_COUNT_PER_EXAM_SCENE,
  });
  // console.log(
  //   "[LOG]/api/exam/scene/prepare - search paragraph for create a new scene",
  //   nextParagraphs
  // );
  // console.log("[API]provideCurExamScene - next paragraphs", response);
  const remainingParagraphs = nextParagraphs;
  // 已经完成所有关卡
  if (remainingParagraphs.length === 0) {
    return resp(
      {
        no_more: true,
      },
      res
    );
  }
  const fakeCreated = {
    caption_id,
    status: ExamStatus.Prepare,
    start: nextParagraphs[0],
    paragraphs: nextParagraphs,
    index: index + 1,
  };
  return resp(fakeCreated, res);
}
