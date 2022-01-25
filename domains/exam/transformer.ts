import dayjs from "dayjs";

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

    startedAt: dayjs(created_at).format("MM/DD HH:mm"),
    endedAt: dayjs(ended_at).format("MM/DD HH:mm"),
  };
}

/**
 * 简单测验场景响应值 转 实例值
 */
export function examSceneRes2Ins(res: IExamSceneRes): IExamSceneValues {
  const {
    id,
    caption_id,
    status,
    start,
    start_id,
    cur,
    spellings,
    paragraphs,
    score,
    created_at,
    begin_at = created_at,
    ended_at,
  } = res;
  const skippedSpellings = [];
  const correctSpellings = [];
  const incorrectSpellings = [];
  for (let i = 0; i < spellings.length; i += 1) {
    const { type } = spellings[i];
    if (type === SpellingResultType.Skipped) {
      skippedSpellings.push(spellings[i]);
      continue;
    }
    if (type === SpellingResultType.Correct) {
      correctSpellings.push(spellings[i]);
      continue;
    }
    if (type === SpellingResultType.Incorrect) {
      incorrectSpellings.push(spellings[i]);
      continue;
    }
  }
  const spellingParagraphIds = spellings.map(
    (spelling) => spelling.paragraph_id
  );
  const remainingParagraphs = paragraphs.filter((paragraph) => {
    const { id } = paragraph;
    return !spellingParagraphIds.includes(id);
  });
  const correctRate =
    correctSpellings.length === 0
      ? 0
      : parseFloat(
          removeZeroAtTail(
            ((correctSpellings.length / spellings.length) * 100).toFixed(2)
          )
        );

  return {
    id,

    captionId: caption_id,

    start,
    startId: start_id,
    cur,

    status,
    correctSpellings,
    incorrectSpellings,
    skippedSpellings,
    remainingParagraphs,

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

export function spellingResultRes2Values(res: ISpellingRes): ISpellingValues {
  const { id, type, paragraph, input, created_at } = res;

  return {
    id,
    type,
    paragraph,
    input,
    createdAt: dayjs(created_at).format("YYYY-MM-DD HH:mm:ss"),
  };
}
