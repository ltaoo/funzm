/**
 * @file 新增测验拼写记录
 */
import { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";

import { ensureLogin } from "@/lib/utils";
import prisma from "@/lib/prisma";

export default async function provideSpellingAddingService(req: NextApiRequest, res: NextApiResponse) {
  const userId = await ensureLogin(req, res);
  const {
    body: { paragraphId, examSceneId, input, type },
  } = req;
    
    const existing = await prisma.spellingResult.findFirst({
      where: {
        paragraph_id: paragraphId,
        exam_scene_id: examSceneId,
      },
    });
    if (existing) {
      // 这种属于异常情况，当拼接记录请求成功，但更新测验当前段落没有成功，会导致用户重复拼写同一个句子，就会出现重复记录
      res.status(200).json({ code: 100, msg: "Existing", data: null });
      return;
    }
    const { id } = await prisma.spellingResult.create({
      data: {
        user_id: userId,
        paragraph_id: paragraphId,
        exam_scene_id: examSceneId,
        type,
        input,
        created_at: dayjs().unix(),
      },
    });
    res.status(200).json({ code: 0, msg: "", data: { id } });
}
