/**
 * @file 签到面板
 */
import { useCallback, useEffect, useRef, useState } from "react";
import cx from "classnames";
import { CheckIcon } from "@ltaoo/icons/outline";

import { fetchCheckInRecordsService } from "@/services/user";
import { checkInService } from "@/services";
import { ICheckInValues } from "@/domains/user/types";

const CheckInInput = () => {
  const [records, setRecords] = useState<ICheckInValues[]>([]);

  const pendingRef = useRef(false);

  useEffect(() => {
    (async () => {
      const checkInRecords = await fetchCheckInRecordsService();
      setRecords(checkInRecords);
    })();
  }, []);

  const checkIn = useCallback(async () => {
    try {
      if (pendingRef.current) {
        return;
      }
      pendingRef.current = true;
      const res = await checkInService();
      pendingRef.current = false;
      alert(`签到成功，获得${res.msg}`);
      const checkInRecords = await fetchCheckInRecordsService();
      setRecords(checkInRecords);
    } catch (err) {
      alert(err.message);
    }
  }, []);

  if (records.length === 0) {
    return (
      <div className="w-full overflow-auto">
        <div className="grid grid-cols-3 gap-2">
          <div className="h-16 px-2 py-2 text-center rounded bg-gray-100"></div>
          <div className="h-16 px-2 py-2 text-center rounded bg-gray-100"></div>
          <div className="h-16 px-2 py-2 text-center rounded bg-gray-100"></div>
          <div className="h-16 col-span-2 px-2 py-2 text-center rounded bg-gray-100"></div>
          <div className="h-16 px-2 py-2 text-center rounded bg-gray-100"></div>
          <div className="h-16 px-2 py-2 text-center rounded bg-gray-100"></div>
          <div className="h-16 col-span-2 px-2 py-2 text-center rounded bg-gray-100"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <div className="grid grid-cols-3 gap-2">
        {records.map((record) => {
          const { day, hasCheckIn, expired, canCheckIn, rewardText } = record;
          return (
            <div
              key={day}
              className={cx(
                "#day px-2 py-2 text-center rounded",
                hasCheckIn
                  ? "text-gray-200 bg-green-800"
                  : "text-gray-200 bg-gray-800",
                expired ? "!bg-gray-300" : "",
                canCheckIn ? "!bg-green-500 cursor-pointer" : "",
                day === 4 ? "col-span-2" : "",
                day === 7 ? "col-span-2" : ""
              )}
              onClick={() => {
                if (!canCheckIn) {
                  return;
                }
                checkIn();
              }}
            >
              <span>{day}</span>
              <div>
                {!hasCheckIn && (
                  <span className="text-sm text-gray-200">{rewardText}</span>
                )}
                {hasCheckIn && (
                  <span className="text-sm text-gray-200">已签到</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckInInput;
