/**
 * @file 加入生词本
 */
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { ensureLogin, resp } from "@/lib/utils";

export default async function provideWordAddingService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);

  const { word, paragraph_id } = req.body;

  if (!word) {
    return resp(10006, res);
  }

  const existing = await prisma.word.findFirst({
    where: {
      text: word,
    },
  });

  if (existing) {
    return resp(15000, res);
  }

  await prisma.word.create({
    data: {
      user_id,
      text: word,
      paragraph_id: paragraph_id ? Number(paragraph_id) : undefined,
    },
  });

  return resp(null, res);
}
