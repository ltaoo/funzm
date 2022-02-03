import { ISpellingValues } from "@/domains/exam/types";

export interface ICaptionRes {
  id: number;
  title: string;

  count: number;

  created_at: string;
}
export interface ICaptionValues {
  id: number;
  title: string;
  paragraphs: IParagraphValues[];
  count: number;
  author: string;
  createdAt: string;
}

/**
 * 句子
 */
export interface IParagraphValues {
  id: number;
  line: string;
  start: string;
  end: string;
  text1: string;
  text2: string;
  valid: boolean;

  notes?: {
    id?: number;
    start: number;
    end: number;
  }[];
  spellings?: ISpellingValues[];
}

export interface CaptionFile {
  title: string;
  type: string;
  paragraphs: IParagraphValues[];
}

export interface DiffNode {
  count: number;
  value: string;
  removed?: boolean;
  added?: boolean;
}

export type SplittedWord = [string, string, string];
