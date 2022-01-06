/**
 * @file 场景测验结果
 */
import { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "@/next-auth/client";
import prisma from "@/lib/prisma";

export default async function provideExamSceneProfileService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) {
    return;
  }
  const id = req.query.id as string;
  const exam = await prisma.examScene.findUnique({
    where: { id },
    include: {
      spellings: true,
    },
  });

  console.log(exam);

  res.status(200).json({
    code: 0,
    msg: "",
    data: exam,
  });
}
