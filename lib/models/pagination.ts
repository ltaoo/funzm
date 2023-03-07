/**
 * 
 * const [params, getResult] = paginationFactory({
    page,
    pageSize,
    search: {
      user_id: userId,
    },
  });
 * @param params 
 * @returns 
 */
export function paginationFactory(params): [any, (list, total: number) => any] {
  return [paginationParams(params), result(params)];
}

export function paginationParams(params) {
  const { page = 1, pageSize = 10, sort, start, skip = 0, search } = params;
  const result: {
    where: string;
    skip: number;
    take: number;
    orderBy?: string;
    cursor?: { id: number };
  } = {
    where: search,
    skip: (page - 1) * pageSize + Number(skip),
    take: Number(pageSize),
  };
  if (sort) {
    result.orderBy = sort;
  }
  const s = Number(start);
  if (!Number.isNaN(s)) {
    result.skip = 1;
    result.cursor = {
      id: s,
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
