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

  if (start === undefined || end === undefined) {
    return resp(10006, res);
  }
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

  const s = dayjs(startTime * 1000);
  const e = dayjs(endTime * 1000);

  const data = await prisma.examStats.findMany({
    where: {
      user_id,
      created_at: {
        gte: s.toDate(),
        lte: e.toDate(),
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const today = dayjs();
  const results = [];
  let cur = s.clone();
  while (!cur.isAfter(e)) {
    const isEmpty = cur.isAfter(today);
    const dd = {
      date: cur.format("YYYY-MM-DD"),
      exam_scene_total: isEmpty ? null : 0,
      success_exam_scene_total: isEmpty ? null : 0,
      failed_exam_scene_total: isEmpty ? null : 0,
      success_spellings_total: isEmpty ? null : 0,
      failed_spellings_total: isEmpty ? null : 0,
      skipped_spellings_total: isEmpty ? null : 0,
      created_at: cur.toDate(),
    };
    data.find((d) => {
      const { created_at } = d;
      if (dayjs(created_at).isSame(cur)) {
        Object.assign(dd, d);
      }
    });
    results.push(dd);
    cur = cur.clone().add(1, "day");
  }

  return resp(results, res);
}
