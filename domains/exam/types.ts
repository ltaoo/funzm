import { IParagraphValues } from "@/domains/caption/types";
import { INoteValues } from "@/domains/note/types";

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
  id: number;
  captionId: number;

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

export interface IExamProgressRes {
  scene_id: number;
  index: number;
  start: IParagraphValues;
  prefect: boolean;
}

export interface IExamSceneRes {
  id: number;
  /**
   * 对应字幕 id
   */
  caption_id: number;
  /**
   * 开始句子 id
   */
  start_id: number;
  start: IParagraphValues;
  /**
   * 当前进行中的拼写 id?
   */
  cur?: number;
  /**
   * 状态
   */
  status: ExamStatus;
  /**
   * 类型
   */
  type?: ExamType;
  /**
   * 关联的拼写列表
   */
  spellings: ISpellingRes[];
  /**
   * 该关卡使用的句子
   */
  paragraphs: IParagraphValues[];
  /**
   * 关卡获得的积分
   */
  score: number;
  /**
   * 关卡创建时间
   */
  created_at: number;
  /**
   * 关卡开始时间
   */
  begin_at?: number;
  /**
   * 关卡结束时间
   */
  ended_at?: number;
  /**
   * 没有更多关卡了
   */
  no_more?: boolean;
  index: number;
  scene_count: number;
}
export interface IExamSceneValues {
  id: number;
  captionId: number;

  type?: ExamType;
  status: ExamStatus;
  score: number;

  startId: number;
  start: IParagraphValues;
  cur?: number;
  // 该字幕的总体进度
  percent: number;

  correctSpellings: ISpellingValues[];
  incorrectSpellings: ISpellingValues[];
  skippedSpellings: ISpellingValues[];

  correctParagraphs: IParagraphValues[];
  incorrectParagraphs: IParagraphValues[];
  skippedParagraphs: IParagraphValues[];
  remainingParagraphs: IParagraphValues[];

  noMore: boolean;
  paragraphs: IParagraphValues[];

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
  id: number;
  type: SpellingResultType;
  input?: string;
  exam_scene_id: number;
  paragraph_id: number;
  paragraph: IParagraphValues;
  created_at: number;
}
export interface ISpellingValues {
  id: number;
  /**
   * 拼写结果（类型）
   */
  type: SpellingResultType;
  /**
   * 该次拼写输入的内容
   * 只有错误时才存在该字段
   */
  input?: string;
  /**
   * 拼写的那段句子
   */
  paragraph_id: number;
  paragraph: IParagraphValues;
  /**
   * 创建时间
   */
  createdAt: string;
}

export interface IIncorrectParagraph {
  id: number;
  text1: string;
  text2: string;
  notes: INoteValues[];
  hasSuccess: boolean;
  spellings: ISpellingValues[];
  incorrectSpellings: ISpellingValues[];
  times: number;
  incorrectTimes: number;
  updatedAt: string;
}
