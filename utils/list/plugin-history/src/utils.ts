import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import qs from "qs";

/**
 * list-helper 中的查询参数转 search 字符串
 * @param params
 * @returns
 */
export function params2Search(
  params: Record<string, any>,
  prevQuery?: Record<string, any>,
  processor?: (value: Record<string, any>) => any
) {
  const rangeKeys = findDateAndRangeKeys(params);
  const valuesNotIncludesDateValue = omit(params, rangeKeys);
  const processedParams = {
    ...valuesNotIncludesDateValue,
    ...(() => {
      return rangeKeys
        .map((key) => {
          const value = params[key];
          return {
            [key]: isRange(value)
              ? (value as [Dayjs, Dayjs]).map((date) => date.unix())
              : value.unix(),
          };
        })
        .reduce((total, cur) => ({ ...total, ...cur }), {});
    })(),
  };
  const { page, pageSize, ...restParams } = processedParams;

  const latestParams = processor ? processor(restParams) : restParams;

  return qs.stringify(
    {
      ...(prevQuery || {}),
      page,
      pageSize,
      search: !isEmptyObject(latestParams)
        ? encodeURIComponent(JSON.stringify(latestParams))
        : undefined,
    },
    { addQueryPrefix: true }
  );
}

/**
 * 从地址栏取到 search 字符串，转换成 list-helper 需要的 params
 * @param search
 * @returns
 */
export function search2Params(queryString: string) {
  const query = qs.parse(queryString, {
    ignoreQueryPrefix: true,
  }) as Record<string, unknown>;

  const { page, pageSize, search: searchString } = query;
  const search = JSON.parse(
    decodeURIComponent((searchString as string) || "{}")
  );

  const dateKeys = findDateAndRangeKeysWithUnix(search);
  const otherSearch = omit(search, dateKeys);

  const result = {
    ...otherSearch,
    ...(() => {
      return dateKeys
        .map((key) => {
          const value = search[key];
          const isRange = Array.isArray(value);
          return {
            [key]: isRange
              ? value.map((date: number) => dayjs(date * 1000))
              : dayjs(value * 1000),
          };
        })
        .reduce((result, cur) => {
          return { ...result, ...cur };
        }, {});
    })(),
  };

  if (page) {
    result.page = Number(page);
  }
  if (pageSize) {
    result.pageSize = Number(pageSize);
  }

  return result;
}

export function sleep(delay: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export function toNumber(obj: Record<string, any>) {
  return Object.keys(obj)
    .map((key) => {
      const value = obj[key];
      if (Number.isNaN(Number(value))) {
        return {
          [key]: value,
        };
      }
      return {
        [key]: Number(value),
      };
    })
    .reduce((result, cur) => {
      return { ...result, ...cur };
    }, {});
}

export function filterEmptyValue(obj: Record<string, any>) {
  return Object.keys(obj)
    .filter((key) => {
      const value = obj[key];
      if ([undefined, null, ""].includes(value)) {
        return false;
      }
      return true;
    })
    .map((key) => {
      return {
        [key]: obj[key],
      };
    })
    .reduce((result, cur) => {
      return { ...result, ...cur };
    }, {});
}

/**
 * 范围时间转换成后端需要的 startTime、endTime 对象
 * @param {[Dayjs, Dayjs]} range - 时间范围
 * @param {[string, string]} [range=['startTime', 'endTime']] - 对象的两个 key
 */
export function rangeToBeginAndEndTime(
  range?: [any, any],
  keys: [string, string] = ["startTime", "endTime"]
) {
  if (range === undefined || range === null) {
    return {};
  }
  return {
    [keys[0]]: dayjs(range[0]).unix(),
    [keys[1]]: dayjs(range[1]).unix(),
  };
}

/**
 * 移除对象中指定字段
 * @param {Record<string, any>} data
 * @param {string[]} keys
 */
export function omit(data: { [key: string]: any }, keys: string[]) {
  if (data === undefined) {
    return {};
  }
  return Object.keys(data)
    .filter((key) => !keys.includes(key))
    .map((key) => {
      return {
        [key]: data[key],
      };
    })
    .reduce((whole, next) => {
      return {
        ...whole,
        ...next,
      };
    }, {});
}

function isDayjs(value: any) {
  if (dayjs.isDayjs(value)) {
    return true;
  }
  return !!value?.$d;
}

function isRange(value: any) {
  if (Array.isArray(value) && value.length === 2 && value.every(isDayjs)) {
    return true;
  }
  return false;
}

/**
 * 从对象中找到是时间范围或者时间的字段，只进行浅层查找。
 * 这是因为时间类型的值无法序列化，所以要特殊处理
 */
function findDateAndRangeKeys(obj: Record<string, unknown>) {
  return Object.keys(obj).filter((key) => {
    const value = obj[key];
    if (isRange(value) || isDayjs(value)) {
      return true;
    }
    return false;
  });
}

function isUnix(value: any) {
  if (typeof value === "number" && String(value).length === 10) {
    return true;
  }
  return false;
}
function findDateAndRangeKeysWithUnix(query: Record<string, unknown>) {
  if (query === undefined) {
    return [];
  }
  return Object.keys(query).filter((key) => {
    const value = query[key];
    if (Array.isArray(value) && value.length === 2 && value.every(isUnix)) {
      return true;
    }
    if (isUnix(value)) {
      return true;
    }
    return false;
  });
}

export function isEmptyObject(value: any) {
  if ([undefined, null].includes(value)) {
    return true;
  }
  if (typeof value === "object" && Object.keys(value).length === 0) {
    return true;
  }
  return false;
}
