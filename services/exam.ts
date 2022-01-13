import { Exam, SpellingResult } from ".prisma/client";

import { SpellingResultType } from "@/domains/exam/constants";
import { partialExamSceneRes2Values } from "@/domains/exam/transformer";
import { IExamSceneRes, IExamSceneValues, IPartialExamSceneValues } from "@/domains/exam/types";

import request from "./request";

/**
 * 根据字幕 id 获取对应的测验（一个字幕只能存在一个测验）
 */
export function fetchExamService(params: { id: string }): Promise<Exam> {
  return request.get(`/api/exam/${params.id}`, {});
}

/**
 * 创建测验记录
 * @param body
 * @returns
 */
export function createExamService(body): Promise<{ id: string }> {
  return request.post("/api/exam/add", body);
}

/**
 * 创建场景测验
 */
export function createExamSceneService(body): Promise<{ id: string }> {
  return request.post("/api/exam/scene/add", body);
}

/**
 * 更新测验记录
 * @param body
 * @returns
 */
export function updateExamService(body): Promise<{ id: string }> {
  return request.post("/api/exam/update", body);
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
}): Promise<SpellingResult[]> {
  return request.get(`/api/exam/result/${id}`, {
    params: { type },
  });
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
}): Promise<SpellingResult[]> {
  return request.get(`/api/exam/result/${id}`, {
    params: { type, includeParagraph: 1 },
  });
}

/**
 * 根据 captionId 获取到当前进行中的场景测验
 */
export function fetchCurExamSceneByCaption({
  captionId,
}): Promise<IExamSceneValues> {
  return request.get("/api/exam/scene/find", {
    params: {
      captionId,
    },
  });
}

/**
 * 获取场景测验列表
 * @param {string} params.id - 字幕 id
 * @returns
 */
export async function fetchExamScenesByCaptionService(params: {
  id: string;
}): Promise<IPartialExamSceneValues[]> {
  const list = (await request.get("/api/exam/scenes/find", {
    params,
  })) as any[];
  return list.map(partialExamSceneRes2Values);
}

/**
 * 获取测验场景详情
 * @param {string} params.id - 测验场景 id
 * @returns
 */
export function fetchExamSceneService(params: {
  id: string;
}): Promise<IExamSceneValues> {
  return request.get(`/api/exam/scene/${params.id}`);
}

/**
 * 获取测验场景详情
 * @param param0
 * @returns
 */
export function fetchExamSceneProfileService({ id }): Promise<IExamSceneRes> {
  return request.get(`/api/exam/scene/${id}?profile=1`);
}

/**
 * 更新测验场景
 * @param body
 * @returns
 */
export function updateExamSceneService(body) {
  return request.post("/api/exam/scene/update", body);
}
