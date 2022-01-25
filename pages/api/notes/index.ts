/**
 * @file 笔记列表
 */
import { NextApiRequest, NextApiResponse } from "next";

import { ensureLogin, resp } from "@/lib/utils";
import { paginationFactory } from "@/lib/models/pagination";
import prisma from "@/lib/prisma";

export default async function provideFetchNotesService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);

  const { page, pageSize } = req.query;

  const [params, getResult] = paginationFactory({
    page,
    pageSize,
    search: {
      user_id,
    },
  });

  const [list, total] = await prisma.$transaction([
    prisma.note.findMany({
      ...params,
      include: {
        paragraph: true,
      },
      orderBy: {
        created_at: "desc",
      },
    }),
    prisma.note.count({ where: params.where }),
  ]);

  return resp(getResult(list, total), res);
}
