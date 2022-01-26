import request from "@/utils/request";

/**
 * 单词翻译
 * @param word
 */
export async function translateService(word) {
  return (await request.get(`/api/translate?word=${word}`)) as {
    explains: string[];
    speeches: {
      text: string;
    }[];
  };
}
