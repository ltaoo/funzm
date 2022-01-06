/**
 * @file 签到
 */
import { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "@/next-auth/client";
import prisma from "@/lib/prisma";
import dayjs from "dayjs";
import { addScore } from "@/lib/models/score";

enum RandomPrize {
  Chape = 1,
  Normal = 2,
}
// 6+10+20+30+42= 108
// skip card 3
// tip  card 5
//                          3*2 + 5*2                      3*8 + 5*8
const signRewards = [6, 10, RandomPrize.Chape, 20, 30, 42, RandomPrize.Normal];
enum ScoreType {
  Get = 1,
  Consume = 2,
}

function getScoreBySignDates(dates, curDay) {
  if ([2, 6].includes(curDay)) {
    if (dates.length === curDay - 1) {
      return signRewards[curDay];
    }
    return null;
  }
  return signRewards[curDay];
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
  const scoreReward = getScoreBySignDates(signDates, currentDay);
  // score reward
  if (typeof scoreReward === "number") {
    await addScore(userId, {
      value: scoreReward,
      type: ScoreType.Get,
      desc: `${current.format("YYYY-MM-DD")} 签到`,
      createdAt: current.clone().unix(),
    });
  } else if (scoreReward === RandomPrize.Chape) {
    // get one skip card
  } else if (scoreReward === RandomPrize.Normal) {
    // get tip card
  }
  res.status(200).json({
    code: 0,
    msg: "sign success",
    data: (() => {
      if (typeof scoreReward === "number") {
        return {
          msg: `积分 ${scoreReward}`,
          value: scoreReward,
        };
      }
      if (scoreReward === RandomPrize.Chape) {
        return {
          msg: "skip card",
        };
      }
      if (scoreReward === RandomPrize.Normal) {
        return {
          msg: "tip card",
        };
      }
    })(),
  });
}
