/**
 * @file 字幕删除
 */
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { ensureLogin, resp } from "@/lib/utils";

export default async function provideCaptionDeletingService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);

  const { id } = req.query as { id: string };
  await prisma.caption.delete({
    where: { id: Number(id) },
  });

  resp(null, res);
}
