/**
 * @file 个人中心
 */
import React from "react";

import Layout from "@/layouts";
import CaptionUpload from "@/components/CaptionFileUpload";

import tmpCaptionStorage from "@/domains/caption/utils";
import router from "next/router";

const Dashboard = (props) => {
  const { user } = props;

  if (user === null) {
    return null;
  }
  return (
    <Layout>
      <div className="">
        <CaptionUpload
          onChange={(caption) => {
            tmpCaptionStorage.save(caption);
            router.push({ pathname: "/captions/editor" });
          }}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;
