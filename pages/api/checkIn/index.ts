/**
 * @file 签到
 */
import { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";

import { getSession } from "@/next-auth/client";
import prisma from "@/lib/prisma";
import { addScore } from "@/lib/models/score";

import { ScoreType } from "@/domains/exam/constants";
import { rewardPerDay, extraRewardForSpecialDay } from './constants';

function getRewardByCheckInDay(day) {
  if (rewardPerDay[day]) {
    return rewardPerDay[day];
  }
  return 0;
}

export default async function provideCheckInService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) {
    res.status(200).json({ code: 401, msg: "请先登录", data: null });
    return;
  }
  const userId = session.user.id as string;
  const current = dayjs();
  const currentDay = current.clone().day();
  const endSecond = dayjs().hour(23).minute(59).second(59).unix();
  const signRecords = await prisma.signRecord.findMany({
    where: {
      userId,
      created_at: {
        gte: dayjs().day(0).hour(0).minute(0).second(0).unix(),
        lt: endSecond,
      },
    },
  });
  const signDates = signRecords.map((record) => record.day);
  const hasSign = signDates.find((day) => {
    return day === currentDay;
  });
  if (hasSign) {
    res.status(200).json({ code: 130, msg: "今天已签到哦~", data: null });
    return;
  }
  await prisma.signRecord.create({
    data: {
      userId,
      day: current.clone().day(),
      created_at: current.clone().unix(),
    },
  });
  const reward = getRewardByCheckInDay(currentDay);
  // score reward
  if (reward) {
    await addScore(userId, {
      value: reward,
      type: ScoreType.Increment,
      desc: `${current.format("YYYY-MM-DD")} 签到`,
      createdAt: current.clone().unix(),
    });
  }
  res.status(200).json({
    code: 0,
    msg: "",
    data: (() => {
      if (reward) {
        return {
          msg: reward.text(),
          value: reward.num,
        };
      }
    })(),
  });
}
