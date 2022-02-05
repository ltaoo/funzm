export interface IUserProfile {
  nickname: string;
  avatar: string;
  score: number;
}
export interface IScoreRes {
  number: number;
  type: number;
  desc: string;
  created_at: Date;
}
export interface IScoreValues {
  number: number;
  type: number;
  desc: string;
  createdAt: string;
}

export interface ITranslateResultRes {
  word: string;
  parts: {
    type: string;
    means: string;
  }[];
  explains: string[];
  speeches: {
    en: string;
    am: string;
  };
  memory_skill: string;
}
