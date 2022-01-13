/**
 * @file 用户详情
 */
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import {
  ChevronRightIcon,
  CurrencyYenIcon,
  ShoppingCartIcon,
} from "@ltaoo/icons/outline";

import { fetchScoreRecordsService, fetchUserProfileService } from "@/services";

const UserProfilePage = () => {
  const [records, setRecords] = useState([]);

  // const [session] = useSession();
  const [user, setUser] = useState(null);

  const router = useRouter();

  const fetchScoreRecordsAndSet = useCallback(async () => {
    const response = await fetchScoreRecordsService();
    console.log(response);
  }, []);
  const fetchUserProfileAndSet = useCallback(async () => {
    const profile = await fetchUserProfileService();
    setUser(profile);
    // console.log(profile);
  }, []);

  useEffect(() => {
    fetchScoreRecordsAndSet();
    fetchUserProfileAndSet();
  }, []);

  // console.log("[PAGE]user/profile - render", session.user);
  if (user === null) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>我的 - 趣字幕</title>
      </Head>
      <div className="flex items-center px-4 py-8 pb-12 bg-green-500">
        <div className="w-16 h-16 rounded-full border-1"></div>
        <div className="">
          <div className="ml-4 text-xl text-white">{user.name}</div>
          <div className="inline-block ml-4 px-1 text-sm text-white bg-green-1000 rounded border-1">
            试用 - 2022年01月07日
          </div>
        </div>
      </div>
      <div className="relative flex top-[-30px] px-4 space-x-4">
        <div className="flex-1 overflow-hidden relative px-4 py-2 bg-white rounded shadow">
          <div
            className="flex items-center justify-between text-gray-800"
            onClick={() => {
              router.push({
                pathname: "/scores",
              });
            }}
          >
            <div>
              <p className="text-xm text-gray-500">积分数</p>
              <p className="text-3xl">{user.score}</p>
            </div>
            <CurrencyYenIcon className="absolute -bottom-6 -right-6 w-20 h-20 text-gray-100" />
          </div>
        </div>
        <div className="flex-1 overflow-hidden relative px-4 py-2 bg-white rounded shadow">
          <div className="flex items-center justify-between text-gray-800">
            <div>
              <p className="text-xm text-gray-500">道具商城</p>
            </div>
            <ShoppingCartIcon className="absolute -bottom-6 -right-6 w-20 h-20 text-gray-100" />
          </div>
        </div>
      </div>
      {/* <div className="px-4">
        <div className="py-2 bg-yellow-500 text-center rounded text-white">
          成为会员
        </div>
      </div> */}
      <div className="px-4">
        <div className="rounded shadow bg-white divide-y">
          <div className="flex items-center justify-between p-4">
            <div className="text-gray-800">我的笔记</div>
            <ChevronRightIcon className="w-4 h-4 text-gray-300" />
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="text-gray-800">我的道具</div>
            <ChevronRightIcon className="w-4 h-4 text-gray-300" />
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="text-gray-800">我的字幕</div>
            <ChevronRightIcon className="w-4 h-4 text-gray-300" />
          </div>
          <div className="flex items-center justify-between p-4" onClick={() => {
            router.push({
              pathname: '/spellings',
            });
          }}>
            <div className="text-gray-800">测验回顾</div>
            <ChevronRightIcon className="w-4 h-4 text-gray-300" />
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="text-gray-800">单词本</div>
            <ChevronRightIcon className="w-4 h-4 text-gray-300" />
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="text-gray-800">错题本</div>
            <ChevronRightIcon className="w-4 h-4 text-gray-300" />
          </div>
        </div>
      </div>
      <div className="mt-8 px-4">
        <div className="py-3 text-center text-white bg-red-500 rounded">
          退出登录
        </div>
      </div>
      <div className="mt-8 py-2 text-center text-gray-300">
        copyright@funzm.com
      </div>
    </div>
  );
};

export default UserProfilePage;
