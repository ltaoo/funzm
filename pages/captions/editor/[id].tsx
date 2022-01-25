/**
 * @file 字幕编辑
 */
import { useCallback, useEffect, useRef, useState } from "react";
import cx from "classnames";
import { useRouter } from "next/router";
import {
  ChevronDoubleDownIcon,
  ExclamationIcon,
  ReplyIcon,
  TrashIcon,
  UserIcon,
} from "@ltaoo/icons/outline";

import useHelper from "@list/hooks";

import Layout from "@/layouts";
import {
  deleteParagraphService,
  updateCaptionService,
  fetchParagraphsService,
  updateParagraphService,
  recoverParagraphService,
  fetchCaptionProfileService,
} from "@/domains/caption/services";
import { mergeMultipleLines } from "@/domains/caption/utils";
import { IParagraphValues } from "@/domains/caption/types";
import ScrollView from "@/components/ScrollView";
import CaptionPreviewSkeleton from "@/components/CaptionPreview/skeleton";
import Tooltip from "@/components/Tooltip";

const CaptionEditorPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const [{ dataSource, initial, noMore }, helper] = useHelper<IParagraphValues>(
    fetchParagraphsService
  );
  const [caption, setCaption] = useState(null);
  const [deletedParagraph, setDeletedParagraph] = useState(null);
  const prevParagraphsRef = useRef(null);
  const dTimerRef = useRef(null);

  useEffect(() => {
    if (id && initial) {
      fetchCaptionProfileService({ id }).then((resp) => {
        setCaption(resp);
      });
      helper.init({
        captionId: id,
      });
    }
  }, [id]);

  const updateTitle = useCallback(
    async (event) => {
      const nextTitle = event.target.innerText;
      setCaption((prev) => {
        return {
          ...prev,
          title: nextTitle,
        };
      });
      const { id, title } = caption;
      if (nextTitle === title) {
        return;
      }
      await updateCaptionService({ id, title: nextTitle });
    },
    [caption]
  );
  const updateText1 = useCallback((updatedParagraph) => {
    return async (event) => {
      const { id, text1 } = updatedParagraph;
      const nextText1 = event.target.innerText;
      if (text1 === nextText1) {
        return;
      }
      await updateParagraphService({ id, text1: nextText1 });
    };
  }, []);
  const updateText2 = useCallback((updatedParagraph) => {
    return async (event) => {
      const { id, text2 } = updatedParagraph;
      const nextText2 = event.target.innerText;
      if (text2 === nextText2) {
        return;
      }
      await updateParagraphService({ id, text2: nextText2 });
    };
  }, []);
  const mergeNextLine = useCallback((curLine) => {
    return () => {
      helper.modifyResponse((resp) => {
        const { dataSource: prevDataSource, ...rest } = resp;
        const matchedLineIndex = prevDataSource.findIndex(
          (pa) => pa.line === curLine
        );
        if (matchedLineIndex === -1) {
          return;
        }
        const nextParagraph = prevDataSource[matchedLineIndex + 1];
        if (!nextParagraph) {
          return;
        }
        const curParagraph = prevDataSource[matchedLineIndex];
        const merged = mergeMultipleLines(curParagraph, nextParagraph);
        prevDataSource.splice(matchedLineIndex, 2, merged);
        updateParagraphService({
          ...merged,
        });
        deleteParagraphService({ id: nextParagraph.id });
        return {
          ...rest,
          dataSource: [...prevDataSource],
        };
      });
    };
  }, []);
  const deleteParagraph = useCallback((deletedParagraph) => {
    return async () => {
      await deleteParagraphService({ id: deletedParagraph.id });
      setDeletedParagraph(deletedParagraph);
      if (dTimerRef.current) {
        clearTimeout(dTimerRef.current);
      }
      dTimerRef.current = setTimeout(() => {
        setDeletedParagraph(null);
      }, 3000);
      helper.modifyResponse((resp) => {
        const { dataSource: prevDataSource, ...rest } = resp;
        prevParagraphsRef.current = prevDataSource;
        const nextParagraphs = prevDataSource.filter((paragraph) => {
          return paragraph.id !== deletedParagraph.id;
        });
        return {
          ...rest,
          dataSource: nextParagraphs,
        };
      });
    };
  }, []);
  const recoverDeletedParagraph = useCallback(async () => {
    if (deletedParagraph === null) {
      return;
    }
    if (prevParagraphsRef.current === null) {
      return;
    }
    await recoverParagraphService({ id: deletedParagraph.id });
    setDeletedParagraph(null);
    helper.modifyResponse((resp) => {
      const { dataSource: prevDataSource, ...rest } = resp;
      return {
        ...rest,
        dataSource: prevParagraphsRef.current,
      };
    });
  }, [deletedParagraph]);

  console.log("[PAGE]caption/editor/[id] - render", dataSource);

  return (
    <Layout title={caption?.title}>
      <ScrollView noMore={noMore} onLoadMore={helper.loadMoreWithLastItem}>
        <div className="">
          {(() => {
            if (initial) {
              return <CaptionPreviewSkeleton />;
            }
            return (
              <div className="relative">
                <div className="#title pb-10 border-b">
                  <h2
                    className="text-5xl break-all"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={updateTitle}
                  >
                    {caption?.title}
                  </h2>
                  <div className="flex items-center mt-4 space-x-8">
                    <div className="flex items-center">
                      <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-gray-400">unknown</span>
                    </div>
                  </div>
                </div>
                <div className="mt-14 pb-20 space-y-16">
                  {dataSource.map((paragraph) => {
                    const { line, text1, text2, valid } = paragraph;
                    return (
                      <div
                        key={line}
                        className={cx("relative group rounded-md")}
                      >
                        <div className="#tool absolute -top-9 flex p-2 space-x-2 bg-gray-800 rounded">
                          <TrashIcon
                            className="w-4 h-4 text-gray-100 cursor-pointer"
                            onClick={deleteParagraph(paragraph)}
                          />
                          <ChevronDoubleDownIcon
                            className={cx(
                              "w-4 h-4 text-gray-100 cursor-pointer"
                            )}
                            onClick={mergeNextLine(line)}
                          />
                          {!valid && (
                            <Tooltip content="该段落缺少中文或英文，建议删除">
                              <ExclamationIcon className="w-4 h-4 text-gray-100 cursor-pointer" />
                            </Tooltip>
                          )}
                        </div>
                        <div>
                          <p
                            className="text1"
                            suppressContentEditableWarning
                            contentEditable
                            onBlur={updateText1(paragraph)}
                          >
                            {text1}
                          </p>
                          <p
                            className="text2"
                            suppressContentEditableWarning
                            contentEditable
                            onBlur={updateText2(paragraph)}
                          >
                            {text2}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
          {deletedParagraph && (
            <div className="fixed bottom-12 right-12">
              <div className="py-3 px-5 bg-gray-800 rounded-xl shadow-xl">
                <div onClick={recoverDeletedParagraph}>
                  <ReplyIcon className="w-6 h-6 text-gray-200 cursor-pointer" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollView>
    </Layout>
  );
};

export default CaptionEditorPage;
