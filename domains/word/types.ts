import { IParagraphValues } from "@/domains/caption/types";

export interface IWordRes {
  id: number;
  text: string;

  paragraph: IParagraphValues;

  created_at: Date;
}

export interface IWordValues {
  id: number;
  text: string;

  paragraph: IParagraphValues;

  createdAt: string;
}
