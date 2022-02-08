/**
 * @file 测验相关接口
 */
import request from "@/utils/request";

import { ExamType } from "./constants";
import { examSceneRes2Values, partialExamSceneRes2Values } from "./transform";
import {
  IExamProgressRes,
  IExamSceneRes,
  IExamSceneValues,
  IPartialExamSceneValues,
} from "./types";

/**
 * 创建测验关卡
 */
export function createExamSceneService(body: {
  caption_id: string;
  type: ExamType;
}) {
  return request.post("/api/exam/scene/add", body) as Promise<IExamSceneRes>;
}

/**
 * 创建测验拼写记录/行为
 */
export function createExamSpellingService(body) {
  return request.post("/api/exam/spelling/add", body);
}

/**
 * 根据 captionId 获取到预备的测验
 * 不会真的的创建，仅仅是预览
 */
export async function fetchPreparedExamSceneService({ captionId }) {
  const resp = (await request.get("/api/exam/scene/prepare", {
    caption_id: captionId,
  })) as IExamSceneRes;

  return examSceneRes2Values(resp);
}

/**
 * 获取场景测验列表
 * @param {string} params.id - 字幕 id
 * @returns
 */
export async function fetchExamScenesByCaptionService(params: {
  id: string;
}): Promise<IPartialExamSceneValues[]> {
  const list = (await request.get("/api/exam/scenes/find", params)) as any[];
  return list.map(partialExamSceneRes2Values);
}

/**
 * 获取进度详情
 */
export async function fetchExamProgressProfileService({ id }) {
  const resp = (await request.get(
    `/api/exam/scene/prepare/detail/${id}`
  )) as IExamSceneRes;

  return examSceneRes2Values(resp);
}

/**
 * 获取测验场景详情
 * @param {string} params.id - 测验场景 id
 * @returns
 */
export function fetchExamSceneService({ id }: { id: string }) {
  return request.get(`/api/exam/scene/${id}`) as Promise<IExamSceneRes>;
}

/**
 * 重新开始指定测验关卡
 */
export function replayExamScene({ id, type }: { id: string; type?: number }) {
  return request.post(`/api/exam/scene/replay/${id}`, {
    type,
  }) as Promise<IExamSceneRes>;
}

/**
 * 获取测验场景详情
 * @param param0
 * @returns
 */
export async function fetchExamSceneProfileService({ id }) {
  const resp = (await request.get(`/api/exam/scene/${id}`)) as IExamSceneRes;
  return examSceneRes2Values(resp) as IExamSceneValues;
}

/**
 * 更新测验场景
 * @param body
 * @returns
 */
export function updateExamSceneService(body) {
  return request.post("/api/exam/scene/update", body);
}

/**
 * 获取测验进度
 */
export async function fetchExamProgressService({ caption_id }) {
  return (await request.get(
    `/api/exam/progress/${caption_id}`
  )) as IExamProgressRes[];
}

/**
 * 创建下一个测验关卡
 */
export function createNextExamScene(body: { scene_id: string }) {
  return request.post("/api/exam/scene/next", body) as Promise<IExamSceneRes>;
}

/**
 * 获取关卡统计
 */
export async function fetchExamSceneStats(params: {
  start: number;
  end: number;
}) {
  const resp = (await request.get("/api/exam/stats", params)) as {
    exam_scene_total: number;
    // 成功次数
    success_exam_scene_total: number;
    // 失败次数
    failed_exam_scene_total: number;
    // 正确拼写次数
    success_spellings_total: number;
    // 错误拼写总数
    failed_spellings_total: number;
    // 跳过拼写总数
    skipped_spellings_total: number;
    created_at: Date;
  }[];

  return resp;
}
