import request from "@/utils/request";

/**
 * 更新用户信息
 */
export function updateUserProfileService({
  nickname,
  avatar,
}: {
  nickname?: string;
  avatar?: string;
}) {
  return request.post("/api/user/update", {
    nickname,
    avatar,
  });
}

/**
 * 获取签到记录
 */
export async function fetchCheckInRecordsService() {
  const records = (await request.get("/api/checkIn/records")) as {
    can_check_in: boolean;
    day: number;
    expired: boolean;
    has_check_in: boolean;
    interrupted: boolean;
    retroactive: boolean;
    reward_text: "20积分";
  }[];
  return records.map((record) => {
    const {
      day,
      can_check_in,
      has_check_in,
      expired,
      interrupted,
      retroactive,
      reward_text,
    } = record;
    return {
      day,
      canCheckIn: can_check_in,
      hasCheckIn: has_check_in,
      expired,
      interrupted,
      retroactive,
      rewardText: reward_text,
    };
  });
}
