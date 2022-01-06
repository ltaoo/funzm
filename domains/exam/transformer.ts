import dayjs from "dayjs";

import { SpellingResultType } from "./constants";
import { ExamSceneValues, IPartialExamSceneValues } from "./types";
import { paddingZero, removeZeroAtTail } from "./utils";

export function partialExamSceneRes2Values(res): IPartialExamSceneValues {
  const { id, status, start, score, created_at, ended_at } = res;

  return {
    id,
    status,

    start,
    score,

    startedAt: dayjs(created_at * 1000).format("YYYY-MM-DD HH:mm:ss"),
    endedAt: dayjs(ended_at * 1000).format("YYYY-MM-DD HH:mm:ss"),
  };
}

export function examSceneRes2Ins(res): ExamSceneValues {
  const {
    id,
    examId,
    captionId,
    status,
    start,
    cur,
    spellings,
    score,
    created_at,
    ended_at,
  } = res;
  const skippedSpellings = spellings.filter(
    (spelling) => spelling.type === SpellingResultType.Skipped
  );
  const correctSpellings = spellings.filter(
    (spelling) => spelling.type === SpellingResultType.Correct
  );
  const incorrectSpellings = spellings.filter(
    (spelling) => spelling.type === SpellingResultType.Incorrect
  );
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

    examId,
    captionId,

    start,
    cur,

    status,
    correctSpellings,
    incorrectSpellings,
    skippedSpellings,

    incorrectParagraphs: incorrectSpellings.map(
      (spelling) => spelling.paragraph
    ),
    correctParagraphs: correctSpellings.map((spelling) => spelling.paragraph),
    skippedParagraphs: skippedSpellings.map((spelling) => spelling.paragraph),

    startedAt: dayjs(created_at * 1000).format("YYYY-MM-DD HH:mm:ss"),
    endedAt: dayjs(ended_at * 1000).format("YYYY-MM-DD HH:mm:ss"),
    score,

    stats: {
      correct: correctSpellings.length,
      incorrect: incorrectSpellings.length,
      skipped: skippedSpellings.length,

      correctRate,
      correctRateText: `${correctRate}%`,

      createdAt: dayjs(created_at * 1000).format("YYYY-MM-DD HH:mm:ss"),
      endAt: dayjs(ended_at * 1000).format("YYYY-MM-DD HH:mm:ss"),
      spend: (() => {
        if (ended_at) {
          const spendSeconds =
            dayjs(ended_at * 1000).unix() - dayjs(created_at * 1000).unix();
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
