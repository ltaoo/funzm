/**
 * @file 删除笔记
 */
import { NextApiRequest, NextApiResponse } from "next";

import { ensureLogin, resp } from "@/lib/utils";
import prisma from "@/lib/prisma";

export default async function provideNoteDeletingService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await ensureLogin(req, res);

  const { id } = req.query;

  await prisma.note.delete({
    where: {
      id: Number(id),
    },
  });

  return resp(null, res);
}
