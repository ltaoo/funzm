import { ensureLogin } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { paginationFactory } from "@/lib/models/paganation";

export default async function provideSpellingsService(req, res) {
  const userId = await ensureLogin(req, res);

  const { page, pageSize, status } = req.query;
  const [params, getResult] = paginationFactory({
    page,
    pageSize,
    search: {
      status,
      userId,
    },
    sort: {
      created_at: "desc",
    },
  });

  const [list, total] = await prisma.$transaction([
    prisma.spellingResult.findMany(params),
    prisma.spellingResult.count({
      where: params.where,
    }),
  ]);

  res.status(200).json({
    code: 0,
    msg: "",
    data: getResult(list, total),
  });
}
