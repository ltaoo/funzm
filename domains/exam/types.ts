import { IParagraphValues } from "@/domains/caption/types";

import { ExamStatus, SpellingResultType } from "./constants";

export interface IPartialExamSceneValues {
  id: string;
  captionId: string;

  score: number;
  status: ExamStatus;

  start: string;

  startedAt: string;
  endedAt: string;
}

export interface IExamSceneDomain {
  paragraphs: IParagraphValues[];
  status: ExamStatus;
  displayedWords: { uid: number; word: string }[];
  curWords: string[][];
  countdown: string;
  index: number;
  curParagraph: IParagraphValues;
  curParagraphId: string;
  inputtingWords: { uid: number; word: string }[];
  correctParagraphs: IParagraphValues[];
  incorrectParagraphs: IParagraphValues[];
  skippedParagraphs: IParagraphValues[];
  remainingParagraphsCount: number;
  stats: {
    score: number;

    incorrect: number;
    correct: number;
    skipped: number;

    correctRate: number;
    correctRateText: string;

    createdAt: string;
    endAt: string;

    spend: null | string;
  };
}
export interface IExamSceneValues {
  id: string;
  examId: string;
  captionId: string;

  status: ExamStatus;
  score: number;

  start: string;
  cur?: string;

  correctSpellings: ISpellingValues[];
  incorrectSpellings: ISpellingValues[];
  skippedSpellings: ISpellingValues[];

  correctParagraphs: IParagraphValues[];
  incorrectParagraphs: IParagraphValues[];
  skippedParagraphs: IParagraphValues[];
  remainingParagraphs: IParagraphValues[];

  startedAt: string;
  endedAt: string;

  stats: {
    score: number;

    incorrect: number;
    correct: number;
    skipped: number;

    correctRate: number;
    correctRateText: string;

    createdAt: string;
    endAt: string;

    spend: null | string;
  };
}

export interface ISpellingValues {
  id: string;
  // 拼写结果（类型）
  type: SpellingResultType;
  // 该次拼写输入的内容
  input: string;
  // 属于哪个测验场景
  examSceneId: string;
  // 拼写的那段句子
  // paragraphId: string;
  paragraph: IParagraphValues;
  // 属于哪个用户
  userId: string;
}
