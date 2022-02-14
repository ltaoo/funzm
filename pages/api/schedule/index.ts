import dayjs from "dayjs";

import { runExamStatsJob } from "@/lib/schedules/exam";
import { runIncorrectParagraphsStatsJob } from "@/lib/schedules/incorrect-paragraphs";
import { ensureLogin, resp } from "@/lib/utils";
import { df } from "@/utils";

let timer = null;
function run() {
  runExamStatsJob();
  runIncorrectParagraphsStatsJob();
  if (timer !== null) {
    clearInterval(timer);
  }
  timer = setInterval(async () => {
    await Promise.all([runExamStatsJob(), runIncorrectParagraphsStatsJob()]);
    console.log(df(dayjs()));
    console.log("/* ----------- SCHEDULE JOB RUN COMPLETED ---------------*/");
  }, 1000 * 5 * 60);
}

export default async function provideJobService(req, res) {
  await ensureLogin(req, res);

  if (timer !== null) {
    run();
    return resp("定时任务重新启动", res);
  }

  run();
  resp("定时任务启动成功", res);
}
