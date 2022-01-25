/**
 * @file 补签
 */
import { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";
import zhCN from "dayjs/locale/zh-cn";

import { ensureLogin } from "@/lib/utils";
import prisma from "@/lib/prisma";

import { fillMissingCheckInDays } from "./utils";

dayjs.locale("zh-CN", zhCN);

export default async function provideRetroactiveService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = await ensureLogin(req, res);

  const day = Number(req.query.day);
  const today = dayjs();
  const todayDay = today.clone().day();
  const firstDay = today.startOf("week");

  if (Number.isNaN(day) || day < 1 || day > 7) {
    res.status(200).json({
      code: 1200,
      msg: "补签天数错误",
      data: null,
    });
    return;
  }
  if (day >= todayDay) {
    res.status(200).json({
      code: 1200,
      msg: "不能补签未来天数",
      data: null,
    });
    return;
  }

  const checkInRecordsBetweenThisWeeks = await prisma.checkInRecord.findMany({
    where: {
      user_id: userId,
      created_at: {
        gte: firstDay.hour(0).minute(0).second(0).toDate(),
        lt: today.clone().toDate(),
      },
    },
  });

  const days = fillMissingCheckInDays(checkInRecordsBetweenThisWeeks, todayDay);

  const theDayWantToRetroactiveTo = days.find((record) => record.day === day);
  if (theDayWantToRetroactiveTo === undefined) {
    res.status(200).json({
      code: 1200,
      msg: "补签天数错误",
      data: null,
    });
    return;
  }

  if (theDayWantToRetroactiveTo.hasCheckIn) {
    res.status(200).json({
      code: 1200,
      msg: "已签到，无法补签",
      data: null,
    });
    return;
  }

  await prisma.checkInRecord.create({
    data: {
      user_id: userId,
      day,
      retroactive: true,
    },
  });

  res.status(200).json({
    code: 0,
    msg: "签到成功",
    data: null,
  });
}
