/**
 * @file 签到
 */
import { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";

import prisma from "@/lib/prisma";
import { addScore } from "@/lib/models/score";

import { ScoreType } from "@/domains/exam/constants";
import { rewardPerDay } from "./constants";
import { ensureLogin, resp } from "@/lib/utils";

function getRewardByCheckInDay(day) {
  if (rewardPerDay[day]) {
    return rewardPerDay[day];
  }
  return 0;
}

const pendingRequestMap = {};

export default async function provideCheckInService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);
  const current = dayjs();
  const currentDay = (() => {
    const t = current.clone().day();
    if (t === 0) {
      return 7;
    }
    return t;
  })();
  const endSecond = dayjs().hour(23).minute(59).second(59).toDate();

  const checkInRecords = await prisma.checkInRecord.findMany({
    where: {
      user_id,
      created_at: {
        gte: current.clone().hour(0).minute(0).second(0).toDate(),
        lt: endSecond,
      },
    },
  });
  const signDates = checkInRecords.map((record) => record.day);
  const hasSign = signDates.find((day) => {
    return day === currentDay;
  });
  if (hasSign) {
    res.status(200).json({ code: 130, msg: "今天已签到哦~", data: null });
    return;
  }
  // 并发问题怎么解决？
  await prisma.checkInRecord.create({
    data: {
      user_id,
      day: currentDay,
    },
  });
  const reward = getRewardByCheckInDay(currentDay);
  // score reward
  if (reward) {
    await addScore(user_id, {
      value: reward.num,
      type: ScoreType.Increment,
      desc: `${current.format("YYYY-MM-DD")} 签到`,
    });
  }

  return resp(
    (() => {
      if (reward) {
        return {
          msg: reward.text(),
          value: reward.num,
        };
      }
      return {
        msg: "未知错误",
      };
    })(),
    res
  );
}
