/**
 * @file 生词本
 */
import { useEffect } from "react";

import Layout from "@/layouts";
import useHelper from "@list/hooks";
import { ISpellingValues } from "@/domains/exam/types";
import ScrollView from "@/components/ScrollView";
import { ChartBarIcon } from "@ltaoo/icons/outline";
import IncomingTip from "@/components/Incoming";
import { fetchWordsService } from "@/services/word";
import { IWordRes, IWordValues } from "@/domains/word/types";

const WordsPage = () => {
  const [{ dataSource, noMore }, helper] =
    useHelper<IWordValues>(fetchWordsService);

  useEffect(() => {
    helper.init();
  }, []);

  return (
    <Layout title="生词本">
      <div className="flex">
        <div className="flex-1 mr-12">
          <div className="text-2xl text-gray-800">我的生词</div>
          <ScrollView noMore={noMore} onLoadMore={helper.loadMoreWithLastItem}>
            <div className="flex flex-wrap mt-4 rounded space-x-4">
              {dataSource.map((word) => {
                const { id, text, paragraph, createdAt } = word;
                return (
                  <div
                    key={id}
                    className="py-2 px-4 min-w-60 bg-white rounded shadow"
                  >
                    <div className="inline-block text-gray-500">
                      <div className="mt-2 text-xl text-gray-500 font-serif">
                        {text}
                      </div>
                      {paragraph && (
                        <>
                          <div className="text-xl font-serif">
                            {paragraph.text2}
                          </div>
                          <div className="mt-4">{paragraph.text1}</div>
                        </>
                      )}
                    </div>
                    <div>
                      <time className="text-gray-300 text-sm">{createdAt}</time>
                    </div>
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

export default WordsPage;
