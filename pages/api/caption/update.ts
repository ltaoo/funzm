/**
 * @file 编辑字幕
 */
import { NextApiRequest, NextApiResponse } from "next";

import { ensureLogin, resp } from "@/lib/utils";
import prisma from "@/lib/prisma";

export default async function provideCaptionEditingService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await ensureLogin(req, res);

  const { id, title } = req.body;
  await prisma.caption.update({
    where: { id: Number(id) },
    data: {
      title,
    },
  });

  return resp(null, res);
}
