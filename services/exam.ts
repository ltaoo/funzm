/**
 * @file 测验相关接口
 */
import { ExamType, SpellingResultType } from "@/domains/exam/constants";
import { partialExamSceneRes2Values } from "@/domains/exam/transformer";
import {
  IExamSceneRes,
  IExamSceneValues,
  IPartialExamSceneValues,
  ISpellingValues,
} from "@/domains/exam/types";
import request from "@/utils/request";

/**
 * 创建测验记录
 * @param body
 * @deprecated
 * @returns
 */
export function createExamService(body) {
  return request.post("/api/exam/add", body);
}

/**
 * 更新测验记录
 * @param body
 * @returns
 */
export function updateExamService(body) {
  return request.post("/api/exam/update", body) as Promise<{ id: string }>;
}

/**
 * 创建测验关卡
 */
export function createExamSceneService(body: {
  caption_id: string;
  type: ExamType;
}) {
  return request.post("/api/exam/scene/add", body) as Promise<{ id: string }>;
}

/**
 * 创建测验拼写记录/行为
 */
export function createExamSpellingService(body) {
  return request.post("/api/exam/spelling/add", body);
}

/**
 * 获取测验结果
 */
export function fetchExamResultStatsService({
  id,
  type,
}: {
  id: string;
  type?: SpellingResultType;
}) {
  return request.get(`/api/exam/result/${id}`, {
    type,
  }) as Promise<ISpellingValues[]>;
}

/**
 * 获取指定类型的测验结果（带句子具体信息）
 */
export function fetchExamResultByTypeService({
  id,
  type,
}: {
  id: string;
  type?: SpellingResultType;
}) {
  return request.get(`/api/exam/result/${id}`, {
    type,
    includeParagraph: 1,
  }) as Promise<ISpellingValues[]>;
}

/**
 * 根据 captionId 获取到预备的测验
 * 不会真的的创建，仅仅是预览
 */
export function fetchPreparedExamService({ captionId }) {
  return request.get("/api/exam/scene/prepare", {
    caption_id: captionId,
  }) as Promise<IExamSceneValues>;
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
 * 获取测验场景详情
 * @param {string} params.id - 测验场景 id
 * @returns
 */
export function fetchExamSceneService(params: { id: string }) {
  return request.get(`/api/exam/scene/${params.id}`) as Promise<IExamSceneRes>;
}

/**
 * 重新开始指定测验关卡
 */
export function replayExamScene({ id }: { id: string }) {
  return request.post(`/api/exam/scene/replay/${id}`) as Promise<IExamSceneRes>;
}

/**
 * 获取测验场景详情
 * @param param0
 * @returns
 */
export function fetchExamSceneProfileService({ id }) {
  return request.get(`/api/exam/scene/${id}`) as Promise<IExamSceneRes>;
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
export function fetchExamProgressService({ caption_id }) {
  return request.get(`/api/exam/progress/${caption_id}`);
}
