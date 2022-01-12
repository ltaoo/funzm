/**
 * @file 记录记录
 */
import { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";

import { ensureLogin } from "@/lib/utils";
import prisma from "@/lib/prisma";

const rewardPerDay = {
  1: "10积分",
  2: "20积分",
  3: "20积分",
  4: "40积分",
  5: "40积分",
  6: "50积分",
};
const extraRewardForSpecialDay = {
  3: "20积分",
  7: "80积分",
};

export default async function provideCheckInRecordsService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = await ensureLogin(req, res);

  const today = dayjs();
  const todayDay = today.clone().day();
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
    const { day, retroactive } = record;
    return {
      day,
      hasCheckIn: true,
      expired: false,
      retroactive,
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
        retroactive: false,
      });
    }
  }
  const result = records.sort((a, b) => {
    return a.day - b.day;
  });
  const todayIndex = result.findIndex((record) => record.day === todayDay);
  const prevDays = result.slice(0, todayIndex);
  const interrupted = prevDays.find(
    (dayRecord) => dayRecord.hasCheckIn === false
  );

  res.status(200).json({
    code: 0,
    msg: "",
    data: result.map((record) => {
        return {
        ...record,
        interrupted: !!interrupted,
      };
    }),
  });
}
