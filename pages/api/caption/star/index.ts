/**
 * @file 获取 star 字幕列表
 */
import { NextApiRequest, NextApiResponse } from "next";

import { ensureLogin, resp } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { paginationFactory } from "@/lib/models/pagination";

export default async function provideFetchStaredCaptionsService(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user_id = await ensureLogin(req, res);

  const { page, pageSize, ...search } = req.query;
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
    prisma.starRecord.findMany({
      ...params,
      include: {
        caption: true,
      },
    }),
    prisma.starRecord.count({
      where: params.where,
    }),
  ]);

  return resp(
    getResult(
      list.map((record) => {
        // @ts-ignore
        const { caption } = record;
        return {
          ...caption,
          ...record,
        };
      }),
      total
    ),
    res
  );
}
