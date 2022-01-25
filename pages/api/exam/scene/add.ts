/**
 * @file 新增测验
 */
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { ensureLogin, resp } from "@/lib/utils";
import {
  ExamStatus,
  PARAGRAPH_COUNT_PER_EXAM_SCENE,
} from "@/domains/exam/constants";

export default async function provideExamSceneAddingService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);

  const { caption_id: c, type: t } = req.body as {
    caption_id: string;
    type: string;
  };
  const caption_id = Number(c);

  console.log("[LOG]/api/exam/scene/add - params", req.body);

  if (Number.isNaN(caption_id)) {
    return resp(10001, res);
  }
  if (!t) {
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
    orderBy: {
      index: "desc",
    },
  });
  // 指定的字幕第一次获取预备测验内容
  if (!existing) {
    // 取第一条句子
    const firstParagraph = await prisma.paragraph.findFirst({
      where: {
        caption_id,
        deleted: false,
      },
    });
    const created = await prisma.examScene.create({
      data: {
        user: { connect: { id: user_id } },
        caption: { connect: { id: caption_id } },
        start: { connect: { id: firstParagraph.id } },
        type: Number(t),
        index: 1,
      },
    });
    console.log();
    console.log(
      "[LOG]/api/exam/scene/add - create new scene if initialize",
      created
    );
    console.log();
    return resp(created, res);
  }

  const { status, index, start, start_id, type } = existing;
  if ([ExamStatus.Prepare, ExamStatus.Started].includes(status)) {
    return resp(existing, res);
  }

  // 最大关卡是失败，需要重来
  if ([ExamStatus.Failed].includes(status)) {
    const created = await prisma.examScene.create({
      data: {
        caption: { connect: { id: caption_id } },
        user: { connect: { id: user_id } },
        start: { connect: { id: start.id } },
        type,
        index,
      },
      include: {
        start: true,
      },
    });
    return resp(created, res);
  }
  // 最大关卡是已完成，就创建下一个
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
  console.log(
    "[LOG]/api/exam/scene/add - create new one",
    index,
    start_id,
    nextParagraphs
  );
  const remainingParagraphs = nextParagraphs;
  if (remainingParagraphs.length === 0) {
    return resp({ id: null }, res);
  }
  const created = await prisma.examScene.create({
    data: {
      caption: { connect: { id: caption_id } },
      user: { connect: { id: user_id } },
      start: { connect: { id: nextParagraphs[0].id } },
      type,
      index: index + 1,
    },
    include: {
      start: true,
    },
  });
  return resp(created, res);
}
