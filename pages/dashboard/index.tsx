/**
 * @file 个人中心
 */
import React from "react";
import Link from "next/link";

import Layout from "@/layouts";
import CaptionUpload from "@/components/CaptionFileUpload";

import tmpCaptionStorage from "@/domains/caption/utils";
import router from "next/router";
import { fetchCaptionsService } from "@/lib/caption";

const Dashboard = (props) => {
  const { user, dataSource = [] } = props;

  // console.log(dataSource);

  if (user === null) {
    return null;
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
        <p className="mt-2 text-center text-base text-sm">查看全部</p>
        <div className="mt-8">
          <CaptionUpload
            onChange={(caption) => {
              tmpCaptionStorage.save(caption);
              router.push({ pathname: "/captions/editor" });
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = async () => {
  const captions = await fetchCaptionsService();
  return {
    props: {
      dataSource: captions,
    },
  };
};

export default Dashboard;
