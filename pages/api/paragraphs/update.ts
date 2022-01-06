/**
 * @file 更新指定句子
 */
import { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "@/next-auth/client";
import prisma from "@/lib/prisma";

export default async function provideParagraphUpdatingService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) {
    return;
  }

  const { body } = req;
  const { id, text1, text2 } = body;
  await prisma.paragraph.update({
    where: {
      id,
    },
    data: {
      text1,
      text2,
    },
  });
  res.status(200).json({ code: 0, msg: "", data: null });
}
