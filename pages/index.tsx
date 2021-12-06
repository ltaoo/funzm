/**
 * @file 官网首页
 */

import React, { useCallback } from "react";
import { useRouter } from "next/router";

import captionTmpStorage from "@/domains/caption/utils";
import CaptionUpload from "@/components/CaptionFileUpload";

import Layout from "@/layouts";

const CaptionPreviewPage = (props) => {
  const router = useRouter();

  // console.log("[PAGE]CaptionManagePage - render", props.data);

  const handleUploadFile = useCallback(async (caption) => {
    captionTmpStorage.save(caption);
    router.push({
      pathname: "/captions/editor",
    });
  }, []);

  return (
    <Layout>
      <div className="flex justify-center">
        <div className="mx-auto px-5">
          <h2 className="m-10 text-4xl text-center">CAPTION PARSER</h2>
          <CaptionUpload onChange={handleUploadFile} />
        </div>
      </div>
    </Layout>
  );
};

export default CaptionPreviewPage;
