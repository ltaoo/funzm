/**
 * @file 按时间段获取测验统计
 */
import { NextApiRequest, NextApiResponse } from "next";

import prisma from '@/lib/prisma';
import { ensureLogin } from "@/lib/utils";

export default async function provideExamStatsService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = await ensureLogin(req, res);

  const { start, end } = req.query;

  const startTime = Number(start) as number;
  const endTime = Number(end) as number;

  if (typeof startTime !== "number" || typeof endTime !== "number") {
    res.status(200).json({
      code: 1000,
      msg: "参数类型错误，请传入数字",
    });
    return;
  }
  if (endTime < startTime) {
    res.status(200).json({
      code: 1000,
      msg: "结束时间不能小于开始时间",
    });
    return;
  }
  if (endTime - startTime > 31 * 24 * 60 * 60) {
    res.status(200).json({
      code: 1000,
      msg: "时间范围不能超过一个月",
    });
    return;
  }

  const data = await prisma.examScene.findMany({
	where: {
	},
	orderBy: {
	  created_at: "desc",
	},
      });
      res.status(200).json({
	code: 0,
	msg: "",
	data,
      });
}
