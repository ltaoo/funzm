import request from "./request";

export function fetchSpellingsService(params) {
  return request.get("/api/spellings", { params });
}
