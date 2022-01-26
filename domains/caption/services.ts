/**
 * @file 字幕接口
 */
import { FetchParams, RequestResponse, Response } from "@list/core";

import request from "@/utils/request";
import { df } from "@/utils";
import { ICaptionRes, IParagraphValues } from "@/domains/caption/types";
import { hasTowLanguage } from "./utils";

/**
 * 新增字幕
 * @param {string} body.title - 字幕名称
 * @param {Paragraph[]} body.paragraphs - 段落
 */
export function addCaptionService(body: {
  title: string;
  paragraphs: IParagraphValues[];
}) {
  return request.post("/api/caption/add", body) as Promise<{ id: string }>;
}

/**
 * 获取字幕基本信息
 * @param id
 */
export async function fetchCaptionWithoutParagraphsService({
  id,
}: {
  id: string;
}) {
  return request.get(`/api/caption/${id}`) as Promise<ICaptionRes>;
}

/**
 * 获取字幕详情
 * @param id
 */
export async function fetchCaptionProfileService({ id }: { id: string }) {
  const resp = (await request.get(`/api/caption/${id}`)) as ICaptionRes;

  const { title, count, created_at } = resp;

  return {
    id,
    title,
    count,
    createdAt: df(created_at),
  };
}

/**
 * 获取字幕列表
 * @param {number} params.page - 页码
 * @returns
 */
export function fetchCaptionsService(params: FetchParams) {
  return request.get("/api/captions", {
    ...params,
  }) as Promise<Response<ICaptionRes>>;
}

/**
 * 编辑字幕详情
 * @param id
 */
export function updateCaptionService(body) {
  return request.post("/api/caption/update", body);
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
export async function fetchParagraphsService(
  params: FetchParams & { captionId: string }
) {
  const resp = (await request.get("/api/paragraphs", {
    ...params,
    caption_id: params.captionId,
  })) as RequestResponse;

  return {
    ...resp,
    list: resp.list.map((paragraph) => {
      return {
        ...paragraph,
        valid: hasTowLanguage(paragraph),
      };
    }),
  };
}

/**
 * 删除指定句子
 */
export function deleteParagraphService({ id }) {
  return request.get("/api/paragraphs/delete", { id });
}

/**
 * 恢复删除的句子
 */
export function recoverParagraphService({ id }) {
  return request.get("/api/paragraphs/recover", { id });
}

/**
 * 更新指定句子
 * @param body
 * @returns
 */
export function updateParagraphService(body: {
  id: number;
  start?: string;
  end?: string;
  text1?: string;
  text2?: string;
}) {
  return request.post("/api/paragraphs/update", body);
}

/**
 *
 */
export function starCaption() {}
