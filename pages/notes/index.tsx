/**
 * @file 笔记列表
 */
import { useEffect } from "react";
import { ChartBarIcon } from "@ltaoo/icons/outline";

import useHelper from "@list/hooks";

import { INoteValues } from "@/domains/note/types";
import Layout from "@/layouts";
import { fetchNotesService } from "@/services/note";
import IncomingTip from "@/components/Incoming";
import ScrollView from "@/components/ScrollView";

const NotesPage = () => {
  const [{ dataSource, noMore }, helper] =
    useHelper<INoteValues>(fetchNotesService);

  useEffect(() => {
    helper.init();
  }, []);

  return (
    <Layout title="笔记">
      <div className="flex">
        <div className="flex-1 mr-12">
          <div className="text-2xl text-gray-800">我的笔记</div>
          <ScrollView noMore={noMore} onLoadMore={helper.loadMoreWithLastItem}>
            <div className="mt-4 space-y-4">
              {dataSource.map((note) => {
                const { id, content, paragraph, createdAt } = note;
                return (
                  <div
                    key={id}
                    className="overflow-hidden bg-gray-100 rounded-xl shadow"
                  >
                    <div className="p-4 text-xl text-gray-800 bg-white">
                      {content}
                    </div>
                    <div className="mt-2 py-2 px-4 text-gray-500">
                      {paragraph.text2}
                    </div>
                    <div className="mt-2 py-2 px-4 text-sm text-gray-300">
                      {createdAt}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollView>
        </div>
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

export default NotesPage;
