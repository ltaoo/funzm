/**
 * @file 测验结果统计
 */
import { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";

import { ensureLogin, resp } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { toBeginAndEnd } from "@/utils/date";
import { getMultipleTypeSpellings } from "@/domains/exam/utils";

export default async function provideSpellingResultStatsService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);

  const spellings = await prisma.spellingResult.findMany({
    where: {
      user_id,
      created_at: toBeginAndEnd(dayjs().add(-1, "day")),
    },
  });

  const { correctSpellings, incorrectSpellings, skippedSpellings } =
    getMultipleTypeSpellings(spellings);
  const result = {
    total: spellings.length,
    skipped: skippedSpellings.length,
    correct: correctSpellings.length,
    incorrect: incorrectSpellings.length,
  };
  return resp(result, res);
}
