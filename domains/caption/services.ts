/**
 * @file 字幕接口
 */
import dayjs from "dayjs";
import { FetchParams, RequestResponse, Response } from "@list/core";

import request from "@/utils/request";
import { df } from "@/utils";
import {
  ICaptionRes,
  ICaptionValues,
  IParagraphValues,
} from "@/domains/caption/types";
import { hasTowLanguage } from "./utils";
import { captionRes2Values } from "./transform";

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
export async function fetchCaptionProfileService({ id }) {
  const resp = (await request.get(`/api/caption/${id}`)) as ICaptionRes;

  const { title, count, is_owner, created_at } = resp;

  return {
    id,
    title,
    count,
    isOwner: is_owner,
    createdAt: dayjs(created_at).format("MM-DD HH:mm"),
  } as ICaptionValues;
}

/**
 * 获取字幕列表
 * @param {number} params.page - 页码
 * @returns
 */
export async function fetchCaptionsService(params) {
  const resp = (await request.get(
    "/api/captions",
    params
  )) as PaginationRes<ICaptionRes>;

  return {
    ...resp,
    list: resp.list.map(captionRes2Values),
  } as PaginationRes<ICaptionValues>;
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
  return request.get(`/api/caption/delete/${id}`);
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
