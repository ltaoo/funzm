import dayjs from "dayjs";

/**
 * 一天的范围
 */
export function toBeginAndEnd(date) {
  const d = dayjs.isDayjs(date) ? date : dayjs(date);

  return {
    gt: d.clone().hour(0).minute(0).second(0).millisecond(0).toDate(),
    lte: d.clone().hour(23).minute(59).second(59).millisecond(59).toDate(),
  };
}
