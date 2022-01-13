/**
 * 奖品
 */
class Reward {
  num: number;
  type: string;
  constructor(num, type) {
    this.num = num;
    this.type = type;
  }
  text() {
    return `${this.num}${this.type}`;
  }
}

// 积分奖励
class ScoreReward extends Reward {

}
// 实物奖励
class GoodsReward extends Reward {

}

export const rewardPerDay = {
  1: new Reward(20, "积分"),
  2: new Reward(20, "积分"),
  3: new Reward(20, "积分"),
  4: new Reward(40, "积分"),
  5: new Reward(50, "积分"),
  6: new Reward(50, "积分"),
  7: new Reward(50, "积分"),
};
export const extraRewardForSpecialDay = {
  3: new Reward(20, "积分"),
  7: new Reward(80, "积分"),
};
