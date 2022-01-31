/**
 * @file 获取生词
 */
import { NextApiRequest, NextApiResponse } from "next";

import { ensureLogin, resp } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { paginationFactory } from "@/lib/models/pagination";

export default async function provideWordsService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);

  const {
    query: { page, pageSize, ...search },
  } = req;
  const [params, getResult] = paginationFactory({
    page,
    pageSize,
    search: {
      user_id,
      ...search,
    },
    sort: {
      created_at: "desc",
    },
  });
  const [list, total] = await prisma.$transaction([
    prisma.word.findMany({
      ...params,
      include: {
        paragraph: true,
      },
    }),
    prisma.word.count({
      where: params.where,
    }),
  ]);

  return resp(getResult(list, total), res);
}
