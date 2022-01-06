import { getSession } from "@/next-auth/client";
import prisma from "@/lib/prisma";
import { Prisma } from ".prisma/client";

function paginationParams(params) {
  const { page, pageSize, skip = 0 } = params;
  return {
    skip: (page - 1) * pageSize + Number(skip),
    take: Number(pageSize),
  };
}

export default async function fetchParagraphsAPI(req, res) {
  const session = await getSession({ req });
  //   console.log("fetchParagraphsAPI", session);
  if (!session) {
    res.status(200).json({ code: 401, msg: "请先登录", data: null });
    return;
  }
  const {
    query: { page = 1, pageSize = 10, start, skip, captionId },
  } = req;
  if (!captionId) {
    res
      .status(200)
      .json({ code: 100, msg: "必须指定要获取的句子所属字幕", data: null });
    return;
  }
  const findManyParams = {
    where: { captionId },
    ...paginationParams({ page, pageSize, skip }),
  } as Prisma.ParagraphFindManyArgs;
  if (start) {
    findManyParams.cursor = {
      id: start,
    };
  }
  const [total, result] = await prisma.$transaction([
    prisma.paragraph.count({
      where: {
        captionId,
      },
    }),
    prisma.paragraph.findMany(findManyParams),
  ]);
  res.status(200).json({
    code: 0,
    msg: "",
    data: {
      page: Number(page),
      pageSize: Number(pageSize),
      total,
      isEnd: result.length < pageSize,
      list: result,
    },
  });
}
