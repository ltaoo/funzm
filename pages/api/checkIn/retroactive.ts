/**
 * @file 补签
 */
import { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";

import { ensureLogin } from "@/lib/utils";
import prisma from "@/lib/prisma";

export default async function provideRetroactiveService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = await ensureLogin(req, res);

  const day = Number(req.query.day);
  const today = dayjs();
  const todayDay = today.clone().day();

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

  const firstDay = today.clone().day(1);
  const lastDay = today.clone().day(6).subtract(1, "day");

  const checkInRecordsBetweenThisWeeks = await prisma.signRecord.findMany({
    where: {
      userId,
      created_at: {
        gte: firstDay.hour(0).minute(0).second(0).unix(),
        lt: lastDay.hour(23).minute(59).second(59).unix(),
      },
    },
  });
  const records = checkInRecordsBetweenThisWeeks.map((record) => {
    const { created_at } = record;
    const day = dayjs(created_at * 1000).day();
    return {
      day,
      hasCheckIn: true,
      expired: false,
      canCheckIn: false,
    };
  });
  for (let i = 1; i <= 7; i += 1) {
    const theDayHasCheckIn = records.find((record) => record.day === i);
    if (theDayHasCheckIn === undefined) {
      records.push({
        day: i,
        hasCheckIn: false,
        expired: i < todayDay,
        canCheckIn: i === todayDay,
      });
    }
  }
  const result = records.sort((a, b) => {
    return a.day - b.day;
  });

  const theDayWantToRetroactiveTo = result.find((record) => record.day === day);
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

  await prisma.signRecord.create({
    data: {
      userId,
      day,
      retroactive: true,
      created_at: today.clone().unix(),
    },
  });

  res.status(200).json({
    code: 0,
    msg: "",
    data: null,
  });
}
