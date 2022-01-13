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
      hasCheckIn: true,
      expired: false,
      retroactive,
      canCheckIn: false,
    };
  });
  for (let i = 1; i <= 7; i += 1) {
    const theDayHasCheckIn = records.find((record) => record.day === i);
    if (theDayHasCheckIn === undefined) {
      records.push({
        day: i,
        hasCheckIn: false,
        expired: i < todayDay,
        canCheckIn: i === todayDay,
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
