/**
 * @file 根据字幕 id 获取所有测验场景
 */
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { ensureLogin } from "@/lib/utils";

export default async function provideExamScenesService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await ensureLogin(req, res);
  const captionId = req.query.id as string;
  const data = await prisma.examScene.findMany({
    where: {
      captionId,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  res.status(200).json({
    code: 0,
    msg: "",
    data,
  });
}
