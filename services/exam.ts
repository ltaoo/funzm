import { Exam } from ".prisma/client";

import request from "./request";

/**
 * 根据字幕 id 获取对应的测验（一个字幕只能存在一个测验）
 */
export function fetchExamByCaptionId(params: { id: string }): Promise<Exam> {
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
 * 创建测验拼写错误
 */
export function createExamSpellingErrorService(body) {
  return request.post("/api/exam/error/add", body);
}
