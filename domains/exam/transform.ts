import dayjs from "dayjs";

import { df } from "@/utils";
import { IParagraphValues } from "@/domains/caption/types";

import { SpellingResultType } from "./constants";
import {
  IExamSceneRes,
  IExamSceneValues,
  IPartialExamSceneValues,
  ISpellingRes,
  ISpellingValues,
} from "./types";
import { paddingZero, removeZeroAtTail } from "./utils";

export function partialExamSceneRes2Values(res): IPartialExamSceneValues {
  const { id, captionId, status, start, score, created_at, ended_at } = res;

  return {
    id,
    captionId,
    status,
    start,
    score,
    startedAt: df(created_at, true),
    endedAt: df(ended_at, true),
  };
}

/**
 * 测验关卡响应值 转 实例值
 */
export function examSceneRes2Values(res: IExamSceneRes): IExamSceneValues {
  const {
    id,
    caption_id,
    status,
    start,
    start_id,
    type,
    cur,
    spellings,
    paragraphs,
    score,
    no_more,
    index,
    scene_count,
    created_at,
    begin_at = created_at,
    ended_at,
  } = res;
  const skippedSpellings: ISpellingValues[] = [];
  const correctSpellings: ISpellingValues[] = [];
  const incorrectSpellings: ISpellingValues[] = [];
  let remainingParagraphs: IParagraphValues[] = [];

  if (spellings && spellings.length) {
    for (let i = 0; i < spellings.length; i += 1) {
      const spelling = spellings[i];
      const { type } = spelling;
      if (type === SpellingResultType.Skipped) {
        skippedSpellings.push(spellingRes2Values(spelling));
      }
      if (type === SpellingResultType.Correct) {
        correctSpellings.push(spellingRes2Values(spelling));
      }
      if (type === SpellingResultType.Incorrect) {
        incorrectSpellings.push(spellingRes2Values(spelling));
      }
    }
    const spellingParagraphIds = spellings.map(
      (spelling) => spelling.paragraph_id
    );
    remainingParagraphs = paragraphs.filter((paragraph) => {
      const { id } = paragraph;
      return !spellingParagraphIds.includes(id);
    });
  }

  const correctRate =
    correctSpellings.length === 0
      ? 0
      : parseFloat(
          removeZeroAtTail(
            (
              (correctSpellings.length / (spellings || []).length) *
              100
            ).toFixed(2)
          )
        );

  return {
    id,

    captionId: caption_id,

    start,
    startId: start_id,
    cur,
    percent: (index / scene_count) * 100,

    status,
    type,
    correctSpellings,
    incorrectSpellings,
    skippedSpellings,
    remainingParagraphs,
    paragraphs,
    noMore: !!no_more,

    incorrectParagraphs: incorrectSpellings.map(
      (spelling) => spelling.paragraph
    ),
    correctParagraphs: correctSpellings.map((spelling) => spelling.paragraph),
    skippedParagraphs: skippedSpellings.map((spelling) => spelling.paragraph),

    startedAt: dayjs(begin_at).format("YYYY-MM-DD HH:mm:ss"),
    endedAt: dayjs(ended_at).format("YYYY-MM-DD HH:mm:ss"),
    score,

    stats: {
      correct: correctSpellings.length,
      incorrect: incorrectSpellings.length,
      skipped: skippedSpellings.length,

      correctRate,
      correctRateText: `${correctRate}%`,

      createdAt: dayjs(begin_at).format("YYYY-MM-DD HH:mm:ss"),
      endAt: dayjs(ended_at).format("YYYY-MM-DD HH:mm:ss"),
      spend: (() => {
        if (ended_at) {
          const spendSeconds = dayjs(ended_at).unix() - dayjs(begin_at).unix();
          const remainingSeconds = spendSeconds % 60;
          const spendMinutes = ((spendSeconds - remainingSeconds) / 60).toFixed(
            0
          );
          return spendSeconds < 60
            ? `${paddingZero(spendSeconds)}秒`
            : `${spendMinutes}分${paddingZero(remainingSeconds)}秒`;
        }
        return null;
      })(),

      score,
    },
  };
}

/**
 * 拼写响应值 2 表单值
 */
export function spellingRes2Values(res: ISpellingRes): ISpellingValues {
  const { id, type, paragraph_id, paragraph, input, created_at } = res;

  return {
    id,
    type,
    paragraph_id,
    paragraph,
    input,
    createdAt: dayjs(created_at).format("YYYY-MM-DD HH:mm:ss"),
  };
}
