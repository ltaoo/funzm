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
    createdAt,
  }: {
    value: number;
    desc: string;
    type: ScoreType;
    createdAt: number;
  }
) {
  console.log("[lib]add score", id, value, desc, type, createdAt);
  const prevScore = await prisma.user.findUnique({
    where: { id },
  });
  let nextScore = prevScore.score;
  if (type === ScoreType.Increment) {
    nextScore += value;
  }
  if (type === ScoreType.Decrement) {
    nextScore -= value;
  }

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      score: nextScore,
    },
  });
  await prisma.scoreRecord.create({
    data: {
      desc,
      type,
      number: value,
      created_at: createdAt,
      userId: id,
    },
  });
  return true;
}
