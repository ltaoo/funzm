/**
 * @file 积分记录列表
 */
import { useEffect } from "react";

import useHelper from "@list/hooks";

import Layout from "@/layouts";
import { fetchScoreRecordsService } from "@/services";
import ScrollView from "@/components/ScrollView";
import { IScoreValues } from "@/domains/user/types";
import { CubeIcon } from "@ltaoo/icons/outline";
import IncomingTip from "@/components/Incoming";

const ScoreRecordsPage = () => {
  const [{ dataSource, noMore }, helper] = useHelper<IScoreValues>(
    fetchScoreRecordsService
  );

  useEffect(() => {
    helper.init();
  }, []);

  console.log(dataSource);

  return (
    <Layout title="积分明细">
      <div className="flex">
        <div className="flex-1 mr-12">
          <div className="text-2xl text-gray-800">积分记录</div>
          <ScrollView noMore={noMore} onLoadMore={helper.loadMore}>
            <div className="mt-4 space-y-4">
              {dataSource.map((record) => {
                const { createdAt, desc, number } = record;
                return (
                  <div
                    key={createdAt}
                    className="py-2 px-4 rounded-xl shadow bg-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className="mt-2 text-gray-800">{desc}</div>
                      <div className="text-2xl text-green-500">{number}</div>
                    </div>
                    <div className="text-gray-300  text-sm">{createdAt}</div>
                  </div>
                );
              })}
            </div>
          </ScrollView>
        </div>
        <div className="w-80 px-8 border-l-1">
          <div className="#check-in mt-2">
            <div className="flex items-center mb-2 text-gray-800">
              <CubeIcon className="w-5 h-5 mr-2 text-gray-800" />
              <span>积分商城</span>
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

export default ScoreRecordsPage;
