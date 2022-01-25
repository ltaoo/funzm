export interface ICheckInValues {
  day: number;
  canCheckIn: boolean;
  hasCheckIn: boolean;
  expired: boolean;
  interrupted: boolean;
  retroactive: boolean;
  rewardText: string;
}

export interface IScoreValues {
  number: number;
  desc: string;
  type: number;
  createdAt: string;
}
