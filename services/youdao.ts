import request from "@/utils/request";

/**
 * 单词翻译
 * @param word
 */
export function translateService(word) {
  return request.get(`/api/translate?word=${word}`);
}
