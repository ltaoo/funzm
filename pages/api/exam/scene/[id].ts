/**
 * @file 根据 id 获取指定字幕
 */
import { ExamStatus } from "@/domains/exam/constants";
import prisma from "@/lib/prisma";
import { ensureLogin } from "@/lib/utils";

export default async function provideExamSceneService(req, res) {
  await ensureLogin(req, res);
  const { query } = req;
  const { id, profile } = query as { id: string; profile: string };
  const data = await prisma.examScene.findUnique({
    where: {
      id,
    },
    include: {
      spellings: {
        orderBy: {
          created_at: "desc",
        },
        include: {
          paragraph: true,
        },
      },
    },
  });
  if (data === null) {
    res.status(200).json({
      code: 130,
      msg: "测验数据不存在，请确认 id 是否正确",
      data: null,
    });
    return;
  }
  const { status, spellings } = data;
  if ([ExamStatus.Completed, ExamStatus.Failed].includes(status)) {
    res.status(200).json({
      code: 0,
      msg: "",
      data,
    });
    return;
  }
  const lastOne = spellings[0];
  // console.log("[LOG]/api/exam/scene/[id].ts - spellings", spellings);
  res.status(200).json({
    code: 0,
    msg: "",
    data: {
      ...data,
      cur: lastOne?.paragraphId,
    },
  });
}
