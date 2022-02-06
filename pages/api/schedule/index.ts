import { runExamStatsJob } from "@/lib/schedules/exam";
import { runIncorrectParagraphsStatsJob } from "@/lib/schedules/incorrect-paragraphs";
import { ensureLogin, resp } from "@/lib/utils";

let timer = null;

export default async function provideJobService(req, res) {
  await ensureLogin(req, res);

  if (timer !== null) {
    return resp("定时任务已经启动", res);
  }

  timer = setInterval(async () => {
    await Promise.all([runExamStatsJob(), runIncorrectParagraphsStatsJob()]);
    console.log("/* ----------- SCHEDULE JOB RUN COMPLETED ---------------*/");
  }, 1000 * 5 * 60);

  resp("定时任务启动成功", res);
}
