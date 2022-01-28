import { ICaptionValues, IParagraphValues } from "@/domains/caption/types";

import { ExamStatus, ExamType, SpellingResultType } from "./constants";

type ExamCallback = (examJSON: IExamSceneDomain) => void;
export interface IExamBaseParams {
  title: string;
  status: ExamStatus;
  curParagraphId: number;
  combo?: number;
  maxCombo?: number;
  paragraphs: IParagraphValues[];
  canComplete?: boolean;

  secondsPerParagraph?: number;

  onChange?: ExamCallback;
  onSkip?: ExamCallback;
  onCorrect?: ExamCallback;
  onIncorrect?: ExamCallback;
  onComplete?: ExamCallback;
  onFailed?: ExamCallback;
  onBeforeSkip?: (value: IExamSceneDomain) => boolean;
  onBeforeNext?: (value: IExamSceneDomain) => boolean;
  onNext?: ExamCallback;
}
export interface IInputExamParams extends IExamBaseParams {}

export interface IPartialExamSceneValues {
  id: string;
  captionId: string;

  score: number;
  status: ExamStatus;

  start: IParagraphValues;

  startedAt: string;
  endedAt: string;
}

export interface IExamSceneDomain {
  paragraphs: IParagraphValues[];
  status: ExamStatus;
  inputting: string;
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

export interface IExamSceneRes {
  id: string;
  caption_id: string;
  start_id: string;
  // user_id: string;
  status: ExamStatus;
  type?: ExamType;
  start: IParagraphValues;
  cur?: string;
  spellings: {
    id: string;
    type: SpellingResultType;
    paragraph_id: string;
  }[];
  paragraphs: IParagraphValues[];
  score: number;
  created_at: number;
  begin_at?: number;
  ended_at?: number;
}
export interface IExamSceneRes {
  id: string;
  caption_id: string;
  user_id: string;

  status: ExamStatus;
  start_id: string;
  cur?: string;

  created_at: number;
  start_at: number;
}
export interface IExamSceneValues {
  id: string;
  captionId: string;

  type?: ExamType;
  status: ExamStatus;
  score: number;

  startId: string;
  start: IParagraphValues;
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

export interface ISpellingRes {
  id: string;
  type: SpellingResultType;
  input?: string;
  exam_scene_id: string;
  paragraph: IParagraphValues;
  created_at: number;
}
export interface ISpellingValues {
  id: string;
  // 拼写结果（类型）
  type: SpellingResultType;
  // 该次拼写输入的内容
  input: string;
  // 属于哪个测验场景
  // examSceneId: string;
  // 拼写的那段句子
  paragraph: IParagraphValues;
  // 属于哪个用户
  // userId: string;
  createdAt: string;
}
