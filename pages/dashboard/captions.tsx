/**
 * @file 个人字幕列表
 */
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import Layout from "@/layouts";
import { getSession } from "@/next-auth/client";
import { fetchCaptionsServer } from "@/lib/caption";

const PersonlyCaptions = (props) => {
  const { user, dataSource = [] } = props;
  const router = useRouter();

  if (user === null) {
    return (
      <div className="mx-auto w-40 mt-10">
        <p className="text-center">No Permission</p>
        <button
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
            const { id, title } = caption;
            return (
              <div
                key={id}
                className="p-2 rounded border break-all cursor-pointer"
              >
                <Link href={`/captions/${id}`}>{title}</Link>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-center text-base text-sm">加载更多</p>
      </div>
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  const captions = await fetchCaptionsServer({ pageSize: 10 }, session?.user);
  return {
    props: {
      user: session?.user ?? null,
      dataSource: captions,
    },
  };
};

export default PersonlyCaptions;
