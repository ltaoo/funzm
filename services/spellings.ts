import request from "@/utils/request";
import { SpellingResultType } from "@/domains/exam/constants";
import { IParagraphValues } from "@/domains/caption/types";
import { df } from "@/utils";

/**
 * 获取所有的拼写
 * @param params
 * @deprecated
 * @returns
 */
export async function fetchSpellingsService(params) {
  const resp = (await request.get("/api/spellings", params)) as {
    list: {
      paragraph: IParagraphValues;
      created_at: Date;
      updated_at?: Date;
    }[];
  };

  return {
    ...resp,
    list: resp.list.map((record) => {
      const { paragraph, created_at, updated_at } = record;
      const { id, text1, text2, notes, spellings } = paragraph;
      const hasSuccess = spellings.find(
        (spelling) => spelling.type === SpellingResultType.Correct
      );
      const incorrectSpellings = spellings.filter(
        (spelling) => spelling.type === SpellingResultType.Incorrect
      );
      return {
        id,
        text1,
        text2,
        notes,
        hasSuccess,
        spellings,
        incorrectSpellings,
        times: spellings.length,
        incorrectTimes: incorrectSpellings.length,
        updatedAt: df(updated_at || created_at),
      };
    }),
  };
}

/**
 * 获取所有出现过错误拼写的句子
 * @param params
 * @returns
 */
export async function fetchIncorrectParagraphsService(params) {
  const resp = (await request.get("/api/incorrect-paragraphs", params)) as {
    list: {
      paragraph: IParagraphValues;
      created_at: Date;
      updated_at?: Date;
    }[];
  };

  return {
    ...resp,
    list: resp.list.map((record) => {
      const { paragraph, created_at, updated_at } = record;
      const { id, text1, text2, notes, spellings } = paragraph;
      const hasSuccess = spellings.find(
        (spelling) => spelling.type === SpellingResultType.Correct
      );
      const incorrectSpellings = spellings.filter(
        (spelling) => spelling.type === SpellingResultType.Incorrect
      );
      return {
        id,
        text1,
        text2,
        notes,
        hasSuccess,
        spellings,
        incorrectSpellings,
        times: spellings.length,
        incorrectTimes: incorrectSpellings.length,
        updatedAt: df(updated_at || created_at),
      };
    }),
  };
}

/**
 * 获取拼写数据统计
 */
export function fetchSpellingsStatsService() {}
