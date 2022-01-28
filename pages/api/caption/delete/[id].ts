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

  const { id: i } = req.query as { id: string };

  const id = Number(i);

  if (Number.isNaN(id)) {
    return resp(10001, res);
  }

  const matched = await prisma.caption.findUnique({
    where: { id },
  });
  if (!matched) {
    return resp(10003, res);
  }
  if (matched.user_id !== user_id) {
    return resp(10003, res);
  }
  await prisma.caption.delete({
    where: { id },
  });

  resp(null, res);
}
