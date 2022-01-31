/**
 * @file 通用接口
 */
import { FetchParams, RequestResponse } from "@list/core";

import { df } from "@/utils";
import request from "@/utils/request";

/**
 * 获取用户详情
 */
export function fetchUserProfileService() {
  return request.get("/api/user/profile");
}

/**
 * 签到
 */
export function checkInService() {
  return request.get("/api/checkIn") as Promise<{ msg: string; score: number }>;
}

/**
 * 获取积分记录
 */
export async function fetchScoreRecordsService(params: FetchParams) {
  const resp = (await request.get("/api/scores", params)) as RequestResponse;

  return {
    ...resp,
    list: resp.list.map((record) => {
      const { desc, number, type, created_at } = record;
      return {
        type,
        number,
        desc,
        createdAt: df(created_at),
      };
    }),
  };
}
