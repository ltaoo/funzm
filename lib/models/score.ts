/**
 * @file 积分
 */
import { ScoreType } from "@/domains/exam/constants";
import prisma from "../prisma";

enum RandomPrize {
  Chape = 1,
  Normal = 2,
}
// 150
// skip card 38
// tip  card 68
const signRewards = [10, 20, RandomPrize.Chape, 30, 40, 50, RandomPrize.Normal];

/**
 * 增加积分
 * @param {string} id - 用户 id
 * @param {number} value - 积分数
 * @param {string} desc - 增加积分原因
 * @param {number} type - 增加还是扣减
 * @param {number} createdAt - 时间
 */
export async function addScore(
  id,
  {
    value,
    desc,
    type,
  }: {
    value: number;
    desc: string;
    type: ScoreType;
  }
) {
  // console.log("[lib]add score", id, value, desc, type, createdAt);
  const prevScore = await prisma.score.findUnique({
    where: { user_id: id },
  });
  let nextScore = prevScore?.value || 0;
  if (type === ScoreType.Increment) {
    nextScore += value;
  }
  if (type === ScoreType.Decrement) {
    nextScore -= value;
  }
  // 兼容，大部分情况不会到这里
  if (!prevScore) {
    await prisma.score.create({
      data: {
        user_id: id,
        value: nextScore,
      },
    });
  } else {
    await prisma.score.update({
      data: {
        value: nextScore,
      },
      where: {
        user_id: id,
      },
    });
  }

  await prisma.scoreRecord.create({
    data: {
      desc,
      type,
      number: value,
      user_id: id,
    },
  });
  return true;
}
