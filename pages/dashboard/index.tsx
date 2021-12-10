/**
 * @file 个人中心
 */
import React from "react";
import router from "next/router";

import Layout from "@/layouts";
import { getSession, signOut } from "@/next-auth/client";
import tmpCaptionStorage from "@/domains/caption/storage";
import { fetchCaptionsService } from "@/lib/caption";
import CaptionCard from "@/components/CaptionCard";
import CaptionUpload from "@/components/CaptionFileUpload";

const Dashboard = (props) => {
  const { user, dataSource = [] } = props;

  if (user === null) {
    return (
      <div className="mx-auto w-40 mt-10 text-center">
        <p className="">No Permission</p>
        <button
          className="mt-2"
          onClick={() => {
            router.push({
              pathname: "/user/login",
            });
          }}
        >
          前往登录
        </button>
      </div>
    );
  }
  return (
    <Layout>
      <div className="text-base">
        <div className="space-y-2">
          {dataSource.map((caption) => {
            const { id } = caption;
            return <CaptionCard key={id} {...caption} />;
          })}
        </div>
        <p
          className="mt-2 text-center text-sm cursor-pointer"
          onClick={() => {
            router.push({
              pathname: "/dashboard/captions",
            });
          }}
        >
          查看全部
        </p>
        <div className="mt-8 divide-y-1">
          <div className="p-4 py-2 text-sm">
            <CaptionUpload
              onChange={(caption) => {
                tmpCaptionStorage.save(caption);
                router.push({ pathname: "/captions/editor" });
              }}
            >
              上传字幕
            </CaptionUpload>
          </div>
          <div className="p-4 py-2 text-sm">个人信息</div>
          <div
            className="p-4 py-2 text-sm"
            onClick={() => {
              signOut({});
              router.push({
                pathname: "/user/login",
              });
            }}
          >
            退出登录
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  const captions = await fetchCaptionsService({ pageSize: 5 }, session?.user);
  return {
    props: {
      user: session?.user ?? null,
      dataSource: captions,
    },
  };
};

export default Dashboard;
