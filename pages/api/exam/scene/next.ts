/**
 * @file 创建下一个测验
 */
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { ensureLogin, resp } from "@/lib/utils";
import { PARAGRAPH_COUNT_PER_EXAM_SCENE } from "@/domains/exam/constants";

export default async function provideCreateNextExamSceneService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);

  const { scene_id: i } = req.body as {
    scene_id: string;
  };
  const scene_id = Number(i);

  console.log("[LOG]/api/exam/scene/next - params", req.body);

  if (Number.isNaN(scene_id)) {
    return resp(10001, res);
  }

  const prev = await prisma.examScene.findUnique({
    where: {
      id: scene_id,
    },
  });

  const { caption_id, index, start_id, type } = prev;
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
    "[LOG]/api/exam/scene/next - create new one",
    index,
    start_id
    // nextParagraphs
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
