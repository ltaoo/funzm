/**
 * @file 获取字幕列表
 */
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { ensureLogin } from "@/lib/utils";
import { paginationFactory } from "@/lib/models/pagination";

export default async function provideCaptionsService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);
  const {
    query: { page, pageSize, ...search },
  } = req;
  const [params, getResult] = paginationFactory({
    page,
    pageSize,
    search: {
      user_id,
      ...search,
    },
    sort: {
      created_at: "desc",
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
