/**
 * @file 字幕上传
 */

import React, { useCallback } from "react";
import { useRouter } from "next/router";

import CaptionUpload from "@/components/CaptionFileUpload";

const CaptionPreviewPage = (props) => {
  const router = useRouter();

  console.log("[PAGE]CaptionManagePage - render", props.data);

  const handleUploadFile = useCallback(async (caption) => {
    const { name, content, ext } = caption;
    localStorage.setItem(
      "tmp-caption",
      JSON.stringify({
        name,
        content,
        ext,
      })
    );
    router.push({
      pathname: "/captions/tmp",
    });
  }, []);

  return (
    <div className="flex justify-center">
      <div className="2xl:container 2xl:mx-auto px-5 sm:px-12 lg:w-240 md:w-80">
        <h2 className="m-10 text-4xl text-center">CAPTION PARSER</h2>
        <CaptionUpload onChange={handleUploadFile} />
        <div className="mt-10">
          <p
            onClick={() => {
              router.push({
                pathname: "/auth/login",
              });
            }}
          >
            前往登录/注册
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaptionPreviewPage;
