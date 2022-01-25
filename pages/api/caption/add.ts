/**
 * @file 新增字幕
 */
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { ensureLogin, resp } from "@/lib/utils";

export default async function provideCaptionAddingService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);

  const { title, paragraphs } = req.body;
  const { id } = await prisma.caption.create({
    data: {
      title,
      paragraphs: {
        create: paragraphs,
      },
      user_id,
    },
  });

  resp({ id }, res);
}
