import { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";

import prisma from "@/lib/prisma";
import { ensureLogin } from "@/lib/utils";
import {
  ExamStatus,
  PARAGRAPH_COUNT_PER_EXAM_SCENE,
} from "@/domains/exam/constants";

export default async function provideCurExamScene(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = await ensureLogin(req, res);
  const captionId = req.query.captionId as string;
  const initialized = await prisma.examScene.findFirst({
    where: {
      captionId: captionId as string,
      // status: ExamStatus.Started
    },
    take: -1,
  });
  if (!initialized) {
    const firstParagraph = await prisma.paragraph.findFirst({
      where: {
        captionId,
      },
    });
    const { id, scenes } = await prisma.exam.create({
      data: {
        userId,
        captionId,
        scenes: {
          create: [
            {
              captionId,
              start: firstParagraph.id,
              created_at: dayjs().unix(),
            },
          ],
        },
        created_at: dayjs().unix(),
      },
      include: {
        scenes: true,
      },
    });
    res.status(200).json({ code: 0, msg: "", data: { id: scenes[0].id } });
    return;
  }
  const { id, status, examId, start } = initialized;
  console.log("[API]provideCurExamScene", id, status, start);
  if ([ExamStatus.Prepare, ExamStatus.Started].includes(status)) {
    res.status(200).json({ code: 0, msg: "", data: initialized });
    return;
  }
  if ([ExamStatus.Failed].includes(status)) {
    const data = await prisma.examScene.create({
      data: {
        captionId,
        examId,
        start,
        created_at: dayjs().unix(),
      },
    });
    res.status(200).json({ code: 0, msg: "", data });
    return;
  }
  // create a new exam scene
  const response = await prisma.paragraph.findMany({
    where: {
      captionId,
    },
    cursor: {
      id: start,
    },
    skip: 1,
    take: 1,
    // take: PARAGRAPH_COUNT_PER_EXAM_SCENE,
  });
  // console.log("[API]provideCurExamScene - next paragraphs", response);
  const remainingParagraphs = response;
  if (remainingParagraphs.length === 0) {
    res.status(200).json({ code: 0, msg: "", data: { id: null } });
    return;
  }
  const createdNewExamScene = await prisma.examScene.create({
    data: {
      captionId,
      examId,
      start: response[0].id,
      created_at: dayjs().unix(),
    },
  });
  res.status(200).json({ code: 0, msg: "", data: createdNewExamScene });
}
