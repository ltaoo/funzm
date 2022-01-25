/**
 * @file 场景测验结果
 */
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { ensureLogin, resp } from "@/lib/utils";

export default async function provideExamSceneProfileService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await ensureLogin(req, res);
  const { id: i } = req.query as { id: string };

  const id = Number(i);

  if (Number.isNaN(id) || typeof id !== "number") {
    return resp(10001, res);
  }

  const exam = await prisma.examScene.findUnique({
    where: { id },
    include: {
      spellings: true,
    },
  });

  resp(exam, res);
}
