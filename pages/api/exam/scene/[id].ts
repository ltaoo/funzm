/**
 * @file 根据 id 获取指定测验详情（结果）
 */
import { ExamStatus, PARAGRAPH_COUNT_PER_EXAM_SCENE } from "@/domains/exam/constants";
import prisma from "@/lib/prisma";
import { ensureLogin } from "@/lib/utils";
import dayjs from "dayjs";

export default async function provideExamSceneService(req, res) {
  await ensureLogin(req, res);
  const { query } = req;
  const { id } = query as { id: string; profile: string };
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
  const { captionId, start, status, spellings } = data;
  const paragraphs = await prisma.paragraph.findMany({
    where: {
      captionId,
    },
    cursor: {
      id: start,
    },
    take: PARAGRAPH_COUNT_PER_EXAM_SCENE,
  });
  if ([ExamStatus.Completed, ExamStatus.Failed].includes(status)) {
    res.status(200).json({
      code: 0,
      msg: "",
      data: {
        ...data,
        paragraphs,
      },
    });
    return;
  }
  // is started
  if (status === ExamStatus.Prepare) {
    const data = await prisma.examScene.update({
      where: {
        id,
      },
      data: {
        status: ExamStatus.Started,
        begin_at: dayjs().unix(),
      },
    });
    res.status(200).json({
      code: 0,
      msg: "",
      data: {
        ...data,
        paragraphs,
      },
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
      paragraphs,
    },
  });
}
