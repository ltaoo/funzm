import { df } from "@/utils";
import request from "@/utils/request";
import { FetchParams, RequestResponse } from "@list/core";

/**
 * 获取生词
 */
export async function fetchWordsService(params: FetchParams) {
  const resp = (await request.get("/api/word/list", params)) as RequestResponse;

  return {
    ...resp,
    list: resp.list.map((res) => {
      const { id, text, paragraph, created_at } = res;
      return {
        id,
        text,
        paragraph,
        createdAt: df(created_at),
      };
    }),
  };
}

/**
 * 添加生词到生词本
 */
export function addWordService({
  word,
  paragraph_id,
}: {
  word: string;
  paragraph_id?: number;
}) {
  return request.post("/api/word/add", {
    word,
    paragraph_id,
  });
}
