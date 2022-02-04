/**
 * @file 获取出现过错误拼写的句子列表
 */
import { NextApiRequest, NextApiResponse } from "next";

import { ensureLogin, resp } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { paginationFactory } from "@/lib/models/pagination";

export default async function provideIncorrectParagraphsService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);

  const { page, pageSize } = req.query;
  const [params, getResult] = paginationFactory({
    page,
    pageSize,
    search: {
      user_id: user_id,
    },
    sort: {
      created_at: "desc",
    },
  });

  const [list, total] = await prisma.$transaction([
    prisma.incorrectParagraph.findMany({
      ...params,
      include: {
        paragraph: {
          include: {
            notes: true,
            spellings: true,
          },
        },
      },
    }),
    prisma.incorrectParagraph.count({
      where: params.where,
    }),
  ]);

  return resp(getResult(list, total), res);
}
