import { useEffect, useState } from "react";

import { fetchUserProfileService } from "@/services";
import { sleep } from "@/utils";

/**
 * 用户信息
 * @returns
 */
export function useUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const [u] = await Promise.all([fetchUserProfileService(), sleep(1000)]);
      setUser(u);
    })();
  }, []);
  return user;
}
