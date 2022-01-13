import { ISpellingRes } from "@/domains/exam/types";
import request from "./request";

export function fetchSpellingsService(
  params
): Promise<{ list: ISpellingRes[] }> {
  return request.get("/api/spellings", { params });
}
