/**
 * @file 新增测验拼写记录
 */
import { NextApiRequest, NextApiResponse } from "next";

import { ensureLogin, resp } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { SpellingResultType } from "@/domains/exam/constants";

export default async function provideSpellingAddingService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);
  const {
    body: { paragraphId, examSceneId, input, type },
  } = req;

  const existing = await prisma.spellingResult.findFirst({
    where: {
      paragraph_id: Number(paragraphId),
      exam_scene_id: Number(examSceneId),
    },
  });
  if (existing) {
    // 这种属于异常情况，当拼写记录请求成功，但更新测验当前段落没有成功，会导致用户重复拼写同一个句子，就会出现重复记录
    res.status(200).json({ code: 100, msg: "Existing", data: null });
    return;
  }

  // let incorrect_spelling_id = undefined;
  // if (type === SpellingResultType.Incorrect) {
  //   const existing = await prisma.incorrectSpelling.findFirst({
  //     where: {
  //       user_id,
  //       paragraph_id: Number(paragraphId),
  //     },
  //   });
  //   // 这个句子第一次出现错误
  //   if (!existing) {
  //     const created = await prisma.incorrectSpelling.create({
  //       data: {
  //         user_id,
  //         paragraph_id: Number(paragraphId),
  //       },
  //     });
  //     incorrect_spelling_id = created.id;
  //   } else {
  //     incorrect_spelling_id = existing.id;
  //   }
  // }
  const { id } = await prisma.spellingResult.create({
    data: {
      user_id,
      paragraph_id: Number(paragraphId),
      exam_scene_id: Number(examSceneId),
      // incorrect_spelling_id,
      type,
      input,
    },
  });

  return resp({ id }, res);
}
