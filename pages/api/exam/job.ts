import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { resp } from "@/lib/utils";
import { ExamStatus } from "@/domains/exam/constants";
import dayjs from "dayjs";
import { getMultipleTypeSpellings } from "@/domains/exam/utils";

export default async function provideIncorrectSpellingStatsService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let flag = await prisma.flag.findFirst();

  if (flag === null) {
    await prisma.flag.create({
      data: {},
    });
  }
  flag = await prisma.flag.findFirst();
  const { exam_scene_flag_id } = flag;
  const fetchArgs = {
    where: {},
    take: 20,
  };
  if (exam_scene_flag_id) {
    // @ts-ignore
    fetchArgs.cursor = {
      id: exam_scene_flag_id,
    };
    // @ts-ignore
    fetchArgs.skip = 1;
  }
  const scenes = await prisma.examScene.findMany({
    ...fetchArgs,
    include: {
      spellings: true,
    },
  });

  if (scenes.length === 0) {
    return resp(null, res);
  }

  console.log("[]scenes total:", scenes.length);
  const map = {};
  for (let i = 0; i < scenes.length; i += 1) {
    const { id, user_id, status, created_at, spellings } = scenes[i];
    console.log(
      "[]for scene: id is",
      id,
      "status is",
      status,
      "and spellings count is ",
      spellings.length
    );
    const { correctSpellings, incorrectSpellings, skippedSpellings } =
      getMultipleTypeSpellings(spellings);
    const created_day = dayjs(created_at)
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0);

    const key = user_id + created_day.format("YYYY-MM-DD");
    const existing = map[key];
    if (existing) {
      map[key] = {
        user_id,
        created_day,

        exam_scene_total: existing.exam_scene_total + 1,
        success_exam_scene_total:
          existing.success_exam_scene_total +
          (status === ExamStatus.Completed ? 1 : 0),
        failed_exam_scene_total:
          existing.failed_exam_scene_total +
          (status === ExamStatus.Failed ? 1 : 0),
        success_spellings_total:
          existing.success_spellings_total + correctSpellings.length,
        failed_spellings_total:
          existing.failed_spellings_total + incorrectSpellings.length,
        skipped_spellings_total:
          existing.skipped_spellings_total + skippedSpellings.length,
      };
    } else {
      map[key] = {
        user_id,
        created_day,

        exam_scene_total: 1,
        success_exam_scene_total: status === ExamStatus.Completed ? 1 : 0,
        failed_exam_scene_total: status === ExamStatus.Failed ? 1 : 0,
        success_spellings_total: correctSpellings.length,
        failed_spellings_total: incorrectSpellings.length,
        skipped_spellings_total: skippedSpellings.length,
      };
    }
  }

  const recordKeys = Object.keys(map);
  for (let i = 0; i < recordKeys.length; i += 1) {
    const {
      user_id,
      created_day,
      exam_scene_total,
      success_exam_scene_total,
      failed_exam_scene_total,
      success_spellings_total,
      failed_spellings_total,
      skipped_spellings_total,
    } = map[recordKeys[i]];
    const e = await prisma.examStats.findFirst({
      where: { user_id, created_at: created_day.clone().toDate() },
    });

    if (e) {
      await prisma.examStats.update({
        where: {
          user_id_created_at: {
            user_id,
            created_at: created_day.clone().toDate(),
          },
        },
        data: {
          exam_scene_total,
          success_exam_scene_total,
          failed_exam_scene_total,
          success_spellings_total,
          failed_spellings_total,
          skipped_spellings_total,
        },
      });
    } else {
      await prisma.examStats.create({
        data: {
          user_id,
          exam_scene_total,
          success_exam_scene_total,
          failed_exam_scene_total,
          success_spellings_total,
          failed_spellings_total,
          skipped_spellings_total,
          created_at: created_day.clone().toDate(),
        },
      });
    }
  }

  await prisma.flag.update({
    where: {
      id: flag.id,
    },
    data: {
      exam_scene_flag_id: (() => {
        const lastOne = scenes.pop();
        if (lastOne) {
          return lastOne.id;
        }
        return flag.exam_scene_flag_id;
      })(),
    },
  });

  return resp(flag, res);
}
