/**
 * @file 字幕列表
 */

import React, { useCallback, useState } from "react";

import { fetchCaptionsService } from "@/lib/caption";

const CaptionsManagePage = (props) => {
  // console.log("[PAGE]CaptionManagePage - render", props.data);

  return (
    <div className="">
      <div className="mx-auto w-180 mt-10 space-v-10">
        {props.data.map((caption) => {
          const { id, title } = caption;
          return (
            <div key={id}>
              <a href={`/caption/${id}`}>
                <p className="text-xl">{title}</p>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CaptionsManagePage;

export async function getStaticProps({ preview = null }) {
  const data = await fetchCaptionsService();
  return {
    props: { data },
  };
}
