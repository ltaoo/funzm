/**
 * 补全签到的天数
 */
export function fillMissingCheckInDays(
  checkInRecordsBetweenThisWeeks,
  todayDay
) {
  const records = checkInRecordsBetweenThisWeeks.map((record) => {
    const { day, retroactive } = record;
    return {
      day,
      has_check_in: true,
      expired: false,
      retroactive,
      can_check_in: false,
    };
  });
  for (let i = 1; i <= 7; i += 1) {
    const theDayHasCheckIn = records.find((record) => record.day === i);
    if (theDayHasCheckIn === undefined) {
      records.push({
        day: i,
        has_check_in: false,
        expired: i < todayDay,
        can_check_in: i === todayDay,
        retroactive: false,
      });
    }
  }
  const result = records.sort((a, b) => {
    return a.day - b.day;
  });
  const todayIndex = result.findIndex((record) => record.day === todayDay);
  const prevDays = result.slice(0, todayIndex);
  const interrupted = prevDays.find(
    (dayRecord) => dayRecord.hasCheckIn === false
  );

  return result.map((record) => {
    return {
      ...record,
      interrupted: !!interrupted,
    };
  });
}
