import request from "./request";

/**
 * 单词翻译
 * @param word
 */
export function translate(word) {
  return request.get(`/api/translate?word=${word}`);
}
