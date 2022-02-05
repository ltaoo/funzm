import { ICaptionRes } from "./types";

/**
 * 字幕 响应值 转 表单值
 */
export function captionRes2Values(res: ICaptionRes) {
  const { id, title } = res;
  return {
    id,
    title,
  };
}
