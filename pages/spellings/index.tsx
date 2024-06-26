/**
 * @file 拼写结果列表
 */
import { useCallback, useEffect, useMemo, useState } from "react";

import Layout from "@/layouts";
import useHelper from "@list/hooks";
import { fetchIncorrectParagraphsService } from "@/services/spellings";
import { IIncorrectParagraph } from "@/domains/exam/types";
import ScrollView from "@/components/ScrollView";
import { ChartBarIcon } from "@ltaoo/icons/outline";
import IncomingTip from "@/components/Incoming";
import HighlightContent from "@/components/HighlightContent";
import {
  addNoteService,
  fetchNotesByParagraphsService,
  updateNoteService,
} from "@/services/note";

const SpellingResultsPage = () => {
  const [notes, setNotes] = useState([]);

  const [{ dataSource, noMore }, helper] = useHelper<IIncorrectParagraph>(
    fetchIncorrectParagraphsService
  );

  const fetchNotesByParagraphs = useCallback(async (ids) => {
    // const ids = Object.keys(ids);
    const notes = await fetchNotesByParagraphsService(ids);
    setNotes((prev) => prev.concat(notes));
  }, []);

  useEffect(() => {
    // Object.keys(paragraphIds).join(",")
    const paragraphIds = dataSource
      .map((s) => {
        return s.id;
      })
      .reduce((total, cur) => {
        return { ...total, [cur]: true };
      }, {});

    const ids = Object.keys(paragraphIds).map(Number);
    if (ids.length) {
      fetchNotesByParagraphs(ids);
    }
  }, [dataSource.length]);

  useEffect(() => {
    helper.init();
    // fetchScoreRecordsAndSet();
    // const res = compareLine(
    //   "Leave him be He can hold his hands with family",
    //   "- Leave him be. - He can hold hands with his family."
    // );
    // console.log(res);
  }, []);

  console.log("[] - render", dataSource);

  return (
    <Layout title="错题记录">
      <div className="flex">
        <div className="flex-1 mr-12">
          <div className="text-2xl text-gray-800">错误拼写</div>
          <ScrollView noMore={noMore} onLoadMore={helper.loadMoreWithLastItem}>
            <div className="mt-4 rounded space-y-4">
              {dataSource.map((record) => {
                const {
                  id,
                  text1,
                  text2,
                  notes,
                  times,
                  incorrectTimes,
                  incorrectSpellings,
                  updatedAt,
                } = record;
                return (
                  <div key={id} className="py-2 px-4 bg-white rounded shadow">
                    <div className="text-gray-500">
                      <div className="text-xl font-serif">
                        <HighlightContent
                          highlights={notes}
                          onSubmit={async ({
                            id: i,
                            content,
                            text,
                            start,
                            end,
                          }) => {
                            if (i) {
                              await updateNoteService({
                                id: i,
                                content,
                              });
                              helper.modifyItem({
                                ...record,
                                ...record,
                                notes: notes?.map((n) => {
                                  if (n.id === i) {
                                    return {
                                      ...n,
                                      content,
                                    };
                                  }
                                  return n;
                                }),
                              });
                            } else {
                              const created = await addNoteService({
                                content,
                                text,
                                start,
                                end,
                                paragraphId: id,
                              });
                              helper.modifyItem({
                                ...record,
                                notes: notes?.concat(created),
                              });
                            }
                          }}
                        >
                          {text2}
                        </HighlightContent>
                      </div>
                      {/* <div className="mt-4">{text1}</div> */}
                    </div>

                    <div className="mt-2 py-2 px-2 text-gray-500 rounded bg-gray-100">
                      {incorrectSpellings.map((spelling) => {
                        const { id: i, input } = spelling;
                        return <div key={i}>{input}</div>;
                      })}
                    </div>
                    <div className="flex items-center justify-between">
                      <time className="text-gray-300 text-sm">{updatedAt}</time>
                      <div className="mt-2 mr-4 text-sm text-gray-300">
                        {incorrectTimes}/{times}
                      </div>
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

export default SpellingResultsPage;
