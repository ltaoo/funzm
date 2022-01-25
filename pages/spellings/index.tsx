/**
 * @file 拼写结果列表
 */
import { useEffect } from "react";

import Layout from "@/layouts";
import useHelper from "@list/hooks";
import { fetchSpellingsService } from "@/services/spellings";
import { SpellingResultType } from "@/domains/exam/constants";
import { ISpellingValues } from "@/domains/exam/types";
import { spellingResultRes2Values } from "@/domains/exam/transformer";
import { compareLine } from "@/domains/caption/utils";
import ScrollView from "@/components/ScrollView";
import { ChartBarIcon } from "@ltaoo/icons/outline";
import IncomingTip from "@/components/Incoming";

const SpellingResultsPage = () => {
  const [{ dataSource, noMore }, helper] = useHelper<ISpellingValues>(
    fetchSpellingsService,
    {
      search: {
        status: SpellingResultType.Incorrect,
      },
    }
  );

  useEffect(() => {
    helper.init();
    // fetchScoreRecordsAndSet();
    // const res = compareLine(
    //   "Leave him be He can hold his hands with family",
    //   "- Leave him be. - He can hold hands with his family."
    // );
    // console.log(res);
  }, []);

  return (
    <Layout title="错题记录">
      <div className="flex">
        <div className="flex-1 mr-12">
          <div className="text-2xl text-gray-800">错误拼写</div>
          <ScrollView noMore={noMore} onLoadMore={helper.loadMoreWithLastItem}>
            <div className="mt-4 rounded space-y-4">
              {dataSource.map((record) => {
                const { type, input, paragraph, createdAt } = record;
                return (
                  <div
                    key={createdAt}
                    className="py-2 px-4 bg-white rounded shadow"
                  >
                    <div className="text-gray-500">
                      <div className="mt-2 text-xl text-red-500 font-serif">
                        {input}
                      </div>
                      <div className="text-xl font-serif">
                        {paragraph.text2}
                      </div>
                      <div className="mt-4">{paragraph.text1}</div>
                    </div>
                    <time className="text-gray-300 text-sm">{createdAt}</time>
                  </div>
                );
              })}
            </div>
          </ScrollView>
        </div>
        <div className="w-80 px-8 border-l-1">
          <div className="#check-in mt-2">
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

export default SpellingResultsPage;
