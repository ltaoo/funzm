/**
 * @file 用户详情
 */
import { useCallback, useEffect, useState } from "react";

import { fetchScoreRecords, fetchUserProfileService } from "@/services";
import { useSession } from "@/next-auth/client";

const UserProfilePage = () => {
  const [records, setRecords] = useState([]);

  const [session] = useSession();

  const fetchScoreRecordsAndSet = useCallback(async () => {
    const response = await fetchScoreRecords();
    console.log(response);
  }, []);
  const fetchUserProfileAndSet = useCallback(async () => {
    const profile = await fetchUserProfileService();
    console.log(profile);
  }, []);

  useEffect(() => {
    fetchScoreRecordsAndSet();
    fetchUserProfileAndSet();
  }, []);

  console.log("[PAGE]user/profile - render", session);

  return (
    <div>
      <div className="inline-flex items-center p-4 shadow">
        <div className="w-10 h-10 rounded border-1"></div>
        <div>
          <div className="ml-4 text-gray-800">{session.user?.name}</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
