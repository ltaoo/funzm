/**
 * @file 获取字幕列表
 */
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { ensureLogin } from "@/lib/utils";
import { paginationFactory } from "@/lib/models/paganation";

export default async function provideCaptionsService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = await ensureLogin(req, res);
  const {
    query: { page, pageSize, ...search },
  } = req;
  const [params, getResult] = paginationFactory({
    page,
    pageSize,
    search: {
      publisherId: userId,
      ...search,
    },
  });
  const [list, total] = await prisma.$transaction([
    prisma.caption.findMany(params),
    prisma.caption.count({
      where: params.where,
    }),
  ]);
  res.status(200).json({
    code: 0,
    msg: "",
    data: getResult(list, total),
  });
}
