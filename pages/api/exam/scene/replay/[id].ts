/**
 * @file 重新开始指定的测验，可传入 type 改变类型
 */
import { NextApiRequest, NextApiResponse } from "next";

import { ensureLogin, resp } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { ExamStatus } from "@/domains/exam/constants";

export default async function provideExamSceneReplayService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);

  const { id: i } = req.query as {
    id: string;
  };
  const { type: t } = req.body as { type?: number };

  // console.log("[LOG]/api/exam/scene/replay - params", req.query);
  const id = Number(i);

  if (Number.isNaN(id)) {
    return resp(10001, res);
  }

  const existing = await prisma.examScene.findFirst({
    where: {
      id,
    },
  });
  if (!existing) {
    return resp(10003, res);
  }

  const { start_id, status, caption_id, index, type } = existing;
  if ([ExamStatus.Prepare, ExamStatus.Started].includes(status)) {
    // 要重新开始的关卡，还有准备或进行中的，就不能重新开始
    return resp(13001, res);
  }

  const created = await prisma.examScene.create({
    data: {
      caption: { connect: { id: caption_id } },
      user: { connect: { id: user_id } },
      start: { connect: { id: start_id } },
      index,
      type: t || type,
    },
    include: {
      start: true,
    },
  });
  return resp(created, res);
}
