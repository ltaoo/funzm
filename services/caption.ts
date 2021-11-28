import axios from "axios";
/**
 * 新增字幕
 */
export function addCaption(caption) {
  return axios.post("/api/caption/add", {
    ...caption,
    published: true,
    authorId: 1,
  });
}
