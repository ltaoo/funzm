import { Prisma } from ".prisma/client";

export function paginationFactory(params): [any, (list, total: number) => any] {
  return [paginationParams(params), result(params)];
}

export function paginationParams(params) {
  const { page = 1, pageSize = 10, start, skip = 0, search } = params;
  const result: Prisma.ParagraphFindManyArgs = {
    where: search,
    skip: (page - 1) * pageSize + Number(skip),
    take: Number(pageSize),
    orderBy: {
      // @ts-ignore
      created_at: "desc",
    },
  };
  if (start) {
    result.cursor = {
      id: start as string,
    };
  }
  return result;
}

function result(params) {
  return (list, total) => {
    const { page = 1, pageSize = 10 } = params;
    const data = {
      page: Number(page),
      pageSize: Number(pageSize),
      total,
      isEnd: list.length < pageSize,
      list,
    };
    return data;
  };
}
