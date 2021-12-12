/**
 * @file 字幕列表
 */

import React, { useMemo } from "react";

import { fetchCaptionsService } from "@/lib/caption";
import Layout from "@/layouts";

const CaptionsManagePage = (props) => {
  const { dataSource } = props;
  // console.log("[PAGE]CaptionManagePage - render", props.data);

  const contentElm = useMemo(() => {
    return (
      <div className="mx-auto w-180 mt-10 space-v-10">
        {dataSource.map((caption) => {
          const { id, title } = caption;
          return (
            <div key={id}>
              <a href={`/captions/${id}`}>
                <p className="text-xl">{title}</p>
              </a>
            </div>
          );
        })}
      </div>
    );
  }, []);

  return (
    <Layout>
      {dataSource.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-2xl">Ooh~ 没有字幕哦</p>
          <div className="btn mt-10">点击上传</div>
        </div>
      ) : (
        contentElm
      )}
    </Layout>
  );
};

export default CaptionsManagePage;

export async function getStaticProps() {
  const dataSource = (await fetchCaptionsService({ pageSize: 20 })) || [];
  return {
    props: { dataSource },
  };
}
