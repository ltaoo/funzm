import request from "@/utils/request";
import { ISpellingRes } from "@/domains/exam/types";

/**
 * 获取所有的错误拼写
 * @param params
 * @returns
 */
export function fetchSpellingsService(params) {
  return request.get("/api/spellings", params) as Promise<{
    list: ISpellingRes[];
  }>;
}

/**
 * 获取拼写数据统计
 */
export function fetchSpellingsStatsService() {

}
