import request from "./request";

/**
 * 获取用户详情
 */
export function fetchUserProfileService() {
  return request.get("/api/user/profile");
}

/**
 * 签到
 */
export function checkInService(): Promise<{ msg: string; score: number }> {
  return request.get("/api/checkIn");
}

/**
 * 获取积分记录
 */
export function fetchScoreRecords() {
  return request.get("/api/scores");
}
