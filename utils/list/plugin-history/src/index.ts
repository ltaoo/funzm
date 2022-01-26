import { PluginAPI } from "@list/core";
import qs from "qs";

import { params2Search, search2Params } from "./utils";

function updatePathname(history: any, query: string) {
  const h = history();
  const { pathname } = h.location;
  const nextPath = pathname + query;
  h.push(nextPath);
}

/**
 * @file 当查询条件改变时，将查询条件同步到地址栏中
 */
export default function historyPlugin(options: {
  history: () => any;
  // 只有地址栏匹配该字符串时，才会从地址栏获取 search 进行初始化
  match?: string;
  // 在请求前，对查询参数的处理，处理后会保存到地址栏之前
  paramsTransform?: (value: Record<string, unknown>) => Record<string, unknown>;
  // 初始化时，从地址栏获取 search 并处理后，保存到 helper 实例之前
  queryTransform?: (value: Record<string, unknown>) => Record<string, unknown>;
}) {
  const { match, history, paramsTransform, queryTransform } = options;
  return function historyPlugin(api: PluginAPI) {
    // @ts-ignore
    // api.register({
    //   key: "beforeRegisterPlugins",
    //   fn(options: any) {
    //     console.log(options);
    //     if (options.history !== true) {
    //       api.skipPlugins(["history"]);
    //     }
    //   },
    // });

    api.register({
      name: "history",
      key: "beforeRequest",
      async fn(curParams = {}) {
        const { pathname, search: searchString } = history().location;
        if (pathname.includes(match)) {
          const search = params2Search(
            curParams,
            qs.parse(searchString, { ignoreQueryPrefix: true }),
            paramsTransform
          );
          // console.log("[]beforeRequest", curParams, search);
          updatePathname(history, search);
        }
      },
    });

    // 初始化时，从地址栏解析参数并作为初始参数
    api.register({
      name: "history",
      key: "getExtraParams",
      fn() {
        const { pathname, search } = history().location;

        if (pathname.includes(match)) {
          const query = search2Params(search);
          const transformedQuery = queryTransform
            ? queryTransform(query)
            : query;

          return transformedQuery;
        }
      },
    });
  };
}
