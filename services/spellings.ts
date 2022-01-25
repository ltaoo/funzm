import { ISpellingRes } from "@/domains/exam/types";
import request from "@/utils/request";

export function fetchSpellingsService(params) {
  return request.get("/api/spellings", params) as Promise<{
    list: ISpellingRes[];
  }>;
}
