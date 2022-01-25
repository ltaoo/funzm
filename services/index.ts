import { RequestResponse } from "@list/core";

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
export async function fetchScoreRecordsService() {
  const resp = (await request.get("/api/scores")) as RequestResponse;

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
