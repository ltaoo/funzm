import { IParagraphValues } from "@/domains/caption/types";

export interface INoteRes {
  id: number;
  caption_id: number;
  paragraph_id: number;

  paragraph: IParagraphValues;

  content: string;
  start: number;
  end: number;

  created_at: string;
}

export interface INoteValues {
  id: number;
  //   captionId: number;
  //   paragraphId: number;

  paragraph: IParagraphValues;

  content: string;
  start: number;
  end: number;

  createdAt: string;
}
