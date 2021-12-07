
import { IParagraph } from "@/domains/caption/types";

import request from "./request";

/**
 * 新增字幕
 */
export function addCaption(caption): Promise<{ id: string }> {
  return request.post("/api/caption/add", caption);
}

/**
 * 获取字幕基本信息
 * @param id
 */
export function fetchCaptionWithoutParagraphs({ id }) {
  return request.get(`/api/caption/${id}`);
}

/**
 * 获取字幕详情
 * @param id
 */
export function fetchCaption({ id }) {
  return request.get(`/api/caption/${id}?paragraph=1`);
}

/**
 * 编辑字幕详情
 * @param id
 */
export function editCaption({ id }) {
  return request.get(`/api/caption/edit?id=${id}`);
}

/**
 * 删除指定字幕
 * @param id
 */
export function deleteCaption({ id }) {
  return request.get(`/api/caption/delete?id=${id}`);
}

/**
 * 获取句子列表
 */
export function fetchParagraphsService(params: {
  page?: number;
  pageSize?: number;
  captionId: string;
}): Promise<{ page: number; pageSize: number; total: number; list: IParagraph[] }> {
  // console.log('fetchParagraphsService', params);
  return request.get("/api/paragraphs", { params });
}
