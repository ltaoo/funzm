/**
 * @file 积分变更记录列表
 */

import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { ensureLogin } from "@/lib/utils";
import { paginationFactory } from "@/lib/models/pagination";

export default async function provideScoreRecordsService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = await ensureLogin(req, res);

  const {
    query: { page, pageSize },
  } = req;
  const [params, getResult] = paginationFactory({
    page,
    pageSize,
    search: {
      user_id: userId,
    },
  });

  const [list, total] = await prisma.$transaction([
    prisma.scoreRecord.findMany({
      ...params,
      orderBy: {
        created_at: "desc",
      },
    }),
    prisma.scoreRecord.count({ where: params.where }),
  ]);

  return res.status(200).json({
    code: 0,
    msg: "",
    data: getResult(list, total),
  });
}
