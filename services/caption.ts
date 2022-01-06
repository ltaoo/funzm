import { Caption } from ".prisma/client";

import { IParagraphValues } from "@/domains/caption/types";
import { localdb } from "@/utils/db";
import { isLocalId, parseLocalId } from "@/utils/db/utils";

import request from "./request";

/**
 * 新增字幕
 * @param {string} body.title - 字幕名称
 * @param {Paragraph[]} body.paragraphs - 段落
 */
export function addCaptionService(body): Promise<{ id: string }> {
  console.log("[SERVICE]caption/addCaptionService", body);
  return request.post("/api/caption/add", body);
}

/**
 * 获取字幕基本信息
 * @param id
 */
export async function fetchCaptionWithoutParagraphsService({
  id,
}): Promise<Caption> {
  if (typeof id === "number") {
    return await localdb.table("captions").get({ id });
  }
  return request.get(`/api/caption/${id}`);
}

/**
 * 获取字幕详情
 * @param id
 */
export function fetchCaptionService({ id }) {
  return request.get(`/api/caption/${id}?paragraph=1`);
}

export function fetchCaptionsService(params) {
  return request.get("/api/captions", params);
}

/**
 * 编辑字幕详情
 * @param id
 */
export function updateCaptionService(body) {
  return request.put("/api/caption/update", body);
}

/**
 * 删除指定字幕
 * @param id
 */
export function deleteCaptionService({ id }) {
  return request.get(`/api/caption/delete?id=${id}`);
}

/**
 * 获取句子列表
 */
export async function fetchParagraphsService(params: {
  page?: number;
  pageSize?: number;
  start?: string;
  skip?: number;
  captionId: string;
}): Promise<{
  page: number;
  pageSize: number;
  total: number;
  isEnd: boolean;
  list: IParagraphValues[];
}> {
  const { captionId } = params;
  if (isLocalId(captionId)) {
    const result = await localdb
      .table("paragraphs")
      .where({
        captionId: parseLocalId(captionId),
      })
      .toArray();
    return {
      list: result,
      total: result.length,
      isEnd: true,
      page: 1,
      pageSize: 100,
    };
  }
  // console.log('fetchParagraphsService', params);
  return request.get("/api/paragraphs", { params });
}

/**
 * 删除指定句子
 */
export function deleteParagraphService({ id }) {
  return request.delete("/api/paragraphs/delete", { params: { id } });
}

/**
 * 更新指定句子
 * @param body
 * @returns
 */
export function updateParagraphService(body) {
  return request.put("/api/paragraphs/update", body);
}
