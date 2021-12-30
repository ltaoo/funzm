export interface IParagraph {
  line: number;
  start: string;
  end: string;
  text1: string;
  text2: string;
}

export interface CaptionFile {
  title: string;
  type: string;
  paragraphs: IParagraph[];
}

export interface DiffNode {
  count: number;
  value: string;
  removed?: boolean;
  added?: boolean;
}
