/**
 * @file 获取预备测验的内容
 */
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { ensureLogin, resp } from "@/lib/utils";
import { PARAGRAPH_COUNT_PER_EXAM_SCENE } from "@/domains/exam/constants";

export default async function providePreparedExamService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);

  const { id: i } = req.query as {
    id?: string;
  };
  const id = Number(i);

  // console.log("[LOG]/api/exam/scene/prepare", req.query);

  if (Number.isNaN(id)) {
    return resp(10001, res);
  }

  const scene = await prisma.examScene.findFirst({
    where: { user_id, id },
    include: {
      start: true,
    },
  });

  if (!scene) {
    return resp(10003, res);
  }

  const { start, status, index, caption_id } = scene;
  const paragraphs = await prisma.paragraph.findMany({
    where: {
      caption_id,
      deleted: false,
    },
    cursor: {
      id: start.id,
    },
    take: PARAGRAPH_COUNT_PER_EXAM_SCENE,
  });
  const completedSceneCount = await prisma.examScene.count({
    where: {
      user_id,
      start_id: start.id,
    },
  });
  const fakeCreated = {
    caption_id,
    index,
    status,
    start,
    start_id: start.id,
    paragraphs,
    completed_scene_count: completedSceneCount,
  };
  return resp(fakeCreated, res);
}
