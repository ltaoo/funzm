/**
 * @file 获取字幕列表
 */
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { ensureLogin } from "@/lib/utils";

export default async function provideCaptionsService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = await ensureLogin(req, res);

  const {
    query: { page, pageSize },
  } = req;
  const captions = await prisma.caption.findMany({
    where: {
      publisherId: userId,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  res.status(200).json({
    code: 0,
    msg: "",
    data: {
      page,
      pageSize,
      total: captions.length,
      list: captions,
    },
  });
}
