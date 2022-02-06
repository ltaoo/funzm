import dayjs from "dayjs";

import { getMultipleTypeSpellings } from "@/domains/exam/utils";

import prisma from "@/lib/prisma";
import { ExamStatus } from "@/domains/exam/constants";

export async function runExamStatsJob() {
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

  console.log("[]start exam stats job and scenes total:", scenes.length);
  if (scenes.length === 0) {
    return;
  }

  const map = {};
  for (let i = 0; i < scenes.length; i += 1) {
    const { id, user_id, status, created_at, spellings } = scenes[i];
    //     console.log(
    //       "[]for scene: id is",
    //       id,
    //       "status is",
    //       status,
    //       "and spellings count is ",
    //       spellings.length
    //     );
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
          exam_scene_total: e.exam_scene_total + exam_scene_total,
          success_exam_scene_total:
            e.success_exam_scene_total + success_exam_scene_total,
          failed_exam_scene_total:
            e.failed_exam_scene_total + failed_exam_scene_total,
          success_spellings_total:
            e.success_spellings_total + success_spellings_total,
          failed_spellings_total:
            e.failed_spellings_total + failed_spellings_total,
          skipped_spellings_total:
            e.skipped_spellings_total + skipped_spellings_total,
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

  runExamStatsJob();
}
