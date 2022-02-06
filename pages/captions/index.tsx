/**
 * @file 字幕列表
 */
import React, { useEffect, useMemo } from "react";

import { ChartBarIcon } from "@ltaoo/icons/outline";
import useHelper from "@list/hooks";

import Layout from "@/layouts";
import { fetchCaptionsService } from "@/domains/caption/services";
import { ICaptionValues } from "@/domains/caption/types";
import IncomingTip from "@/components/Incoming";
import ScrollView from "@/components/ScrollView";
import CaptionCard from "@/components/CaptionCard";

const CaptionsManagePage = () => {
  const [{ dataSource, noMore }, helper] =
    useHelper<ICaptionValues>(fetchCaptionsService);

  useEffect(() => {
    helper.init();
  }, []);

  const contentElm = useMemo(() => {
    if (dataSource.length === 0) {
      return (
        <div className="mt-16 text-center">
          <p className="text-2xl">ooh~ 还没有字幕</p>
          <div className="mt-10 py-2 px-4 text-gray-100 bg-gray-800 rounded shadow">
            点击上传
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="text-2xl text-gray-800">字幕列表</div>
        <ScrollView noMore={noMore} onLoadMore={helper.loadMoreWithLastItem}>
          <div className="mt-4 space-y-4">
            {dataSource.map((caption) => {
              const { id } = caption;
              return <CaptionCard key={id} {...caption} />;
            })}
          </div>
        </ScrollView>
      </div>
    );
  }, [dataSource]);

  return (
    <Layout title="字幕列表">
      <div className="flex">
        <div className="flex-1 mr-12">{contentElm}</div>
        <div className="w-80 px-8 border-l-1">
          <div className="mt-2">
            <div className="flex items-center mb-2 text-gray-800">
              <ChartBarIcon className="w-5 h-5 mr-2 text-gray-800" />
              <span>统计</span>
            </div>
            <div className="mt-4">
              <IncomingTip />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CaptionsManagePage;
