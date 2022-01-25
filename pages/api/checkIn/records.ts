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
  let todayDay = today.clone().day();
  todayDay = todayDay === 0 ? 7 : todayDay;
  const firstDay = today.startOf("week");

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

  res.status(200).json({
    code: 0,
    msg: "",
    data: days.map((record) => {
      const { day } = record;
      return {
        ...record,
        reward_text: rewardPerDay[day] ? rewardPerDay[day].text() : undefined,
        extra_reward_text: extraRewardForSpecialDay[day]
          ? extraRewardForSpecialDay[day].text()
          : undefined,
      };
    }),
  });
}
