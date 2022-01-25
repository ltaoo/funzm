/**
 * @file 获取句子列表
 */
import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma";
import { ensureLogin, resp } from "@/lib/utils";
import { paginationFactory } from "@/lib/models/pagination";

export default async function provideFetchParagraphsService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await ensureLogin(req, res);
  const {
    query: { page = 1, pageSize = 10, start, skip, caption_id: ci },
  } = req;

  const caption_id = Number(ci);
  if (Number.isNaN(caption_id)) {
    resp(10001, res);
    return;
  }
  const [findManyParams, getResult] = paginationFactory({
    page,
    pageSize,
    start,
    skip,
    search: {
      caption_id,
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
