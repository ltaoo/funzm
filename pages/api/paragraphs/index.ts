/**
 * @file 获取句子列表
 */
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { ensureLogin } from "@/lib/utils";
import { paginationFactory } from "@/lib/models/paganation";

export default async function provideFetchParagraphsService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await ensureLogin(req, res);
  const {
    query: { page = 1, pageSize = 10, start, skip, captionId },
  } = req;
  if (!captionId) {
    res
      .status(200)
      .json({ code: 100, msg: "必须指定要获取的句子所属字幕", data: null });
    return;
  }
  const [findManyParams, getResult] = paginationFactory({
    page,
    pageSize,
    start,
    skip,
    search: {
      caption_id: captionId,
      deleted: false,
    },
  });

  const [total, list] = await prisma.$transaction([
    prisma.paragraph.count({
      where: findManyParams.where,
    }),
    prisma.paragraph.findMany(findManyParams),
  ]);

  res.status(200).json({
    code: 0,
    msg: "",
    data: getResult(list, total),
  });
}
