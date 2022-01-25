export enum ExamType {
  // 选择
  Selection = 1,
  // 拼写
  Spelling = 2,
  // 语音
  Speak = 3,
}

export enum ScoreType {
  Increment = 1,
  Decrement = 2,
}

export enum SpellingResultType {
  Correct = 1,
  Incorrect = 2,
  Skipped = 3,
}

export enum ExamStatus {
  Prepare = 1,
  Started = 2,
  Completed = 3,
  Failed = 4,
}

export const examStatusTexts = {
  [ExamStatus.Prepare]: "未开始",
  [ExamStatus.Started]: "进行中",
  [ExamStatus.Completed]: "已完成",
  [ExamStatus.Failed]: "失败",
};

// 预计每个句子消耗的秒数
export const EXPECTED_SECONDS_PER_PARAGRAPH = 6;
// 拼写正确的积分奖励数
export const REWARD_SCORES_FOR_CORRECT_SPELLING = 6;
// 拼写错误的积分扣除数
export const DECREMENT_SCORES_FOR_INCORRECT_SPELLING = 3;
// 剩余秒数每秒奖励积分
export const REWARD_SCORES_FOR_REMAINING_PER_SECOND = 1;
// 每次测验获取的句子数
export const PARAGRAPH_COUNT_PER_EXAM_SCENE = 20;
export const CORRECT_RATE_NEEDED_FOR_COMPLETE = 60;
