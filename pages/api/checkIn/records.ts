/**
 * @file 记录记录
 */
import { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";
import zhCN from "dayjs/locale/zh-cn";

import { ensureLogin } from "@/lib/utils";
import prisma from "@/lib/prisma";

import { rewardPerDay, extraRewardForSpecialDay } from "./constants";
import { fillMissingCheckInDays } from "./utils";

dayjs.locale("zh-CN", zhCN);

export default async function provideCheckInRecordsService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = await ensureLogin(req, res);

  const today = dayjs();
  const todayDay = today.clone().day();
  const firstDay = today.startOf("week");

  const checkInRecordsBetweenThisWeeks = await prisma.signRecord.findMany({
    where: {
      userId,
      created_at: {
        gte: firstDay.hour(0).minute(0).second(0).unix(),
        lt: today.clone().unix(),
      },
    },
  });

  const days = fillMissingCheckInDays(checkInRecordsBetweenThisWeeks, todayDay);

  res.status(200).json({
    code: 0,
    msg: "",
    data: days.map((record) => {
      const { day } = record;
      return {
        ...record,
        rewardText: rewardPerDay[day] ? rewardPerDay[day].text() : undefined,
        extraRewardText: extraRewardForSpecialDay[day] ? extraRewardForSpecialDay[day].text() : undefined,
      };
    }),
  });
}
