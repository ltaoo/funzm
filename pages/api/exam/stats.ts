/**
 * @file 按时间段获取测验统计
 */
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { ensureLogin, resp } from "@/lib/utils";
import dayjs from "dayjs";

export default async function provideExamStatsService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);

  const { start, end } = req.query;

  const startTime = Number(start) as number;
  const endTime = Number(end) as number;

  if (typeof startTime !== "number" || typeof endTime !== "number") {
    return resp(10001, res);
  }
  if (endTime < startTime) {
    return resp(10005, res);
  }
  if (endTime - startTime > 31 * 24 * 60 * 60) {
    return resp(10004, res);
  }

  const data = await prisma.examStats.findMany({
    where: {
      user_id,
      created_at: {
        gt: dayjs(startTime * 1000).toDate(),
        lte: dayjs(endTime * 1000).toDate(),
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return resp(data, res);
}
