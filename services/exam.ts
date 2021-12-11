import { Exam, SpellingResult } from ".prisma/client";
import { SpellingResultType } from "@/domains/exam/constants";

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
