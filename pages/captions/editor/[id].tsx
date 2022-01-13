/**
 * @file 字幕编辑
 */
import { useCallback, useEffect, useRef, useState } from "react";
import cx from "classnames";
import Head from "next/head";
import { useRouter } from "next/router";
import { CogIcon, TrashIcon } from "@ltaoo/icons/outline";
import debounce from "lodash.debounce";

import {
  deleteParagraphService,
  updateCaptionService,
  fetchCaptionWithoutParagraphsService,
  fetchParagraphsService,
  updateParagraphService,
  recoverParagraphService,
} from "@/services/caption";
import { parseCaptionContent } from "@/domains/caption";
import { localdb } from "@/utils/db";
import { parseLocalId } from "@/utils/db/utils";
import { splitMergedParagraphs } from "@/domains/caption/utils";
import FixedFooter from "@/components/FixedFooter";

const CaptionEditorPage = () => {
  const router = useRouter();

  const [caption, setCaption] = useState(null);
  const [paragraphs, setParagraphs] = useState([]);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const totalRef = useRef(0);

  const prevParagraphsRef = useRef(null);
  const [deletedParagraphId, setDeletedParagraphsId] = useState(null);

  const id = parseLocalId(router.query.id) as string;
  const idRef = useRef(id);

  useEffect(() => {
    idRef.current = id;
  }, [id]);

  const fetchCaptionAndSave = useCallback(async (id) => {
    const response = await fetchCaptionWithoutParagraphsService({ id });
    setCaption(response);
    // @ts-ignore
    if (response.content) {
      const paragraphs = parseCaptionContent(
        response.content,
        // @ts-ignore
        response.type
      ).map((paragraph) => {
        return {
          ...paragraph,
          captionId: id,
        };
      });
      localdb.table("paragraphs").bulkAdd(paragraphs);
      const newCaption = { ...response };
      delete newCaption.content;
      localdb.table("captions").put(newCaption, id);
      setParagraphs(paragraphs);
      totalRef.current = paragraphs.length;
      return { idEnd: true, total: paragraphs.length };
    }
    loadingRef.current = true;
    const {
      list: paragraphs,
      total,
      isEnd,
    } = await fetchParagraphsService({
      captionId: id,
      page: pageRef.current,
    });
    loadingRef.current = false;
    pageRef.current += 1;
    totalRef.current = total;
    setParagraphs(paragraphs);
    return { isEnd, total };
  }, []);

  useEffect(() => {
    const handler = debounce(async () => {
      if (
        document.documentElement.scrollTop +
          document.documentElement.clientHeight +
          200 >=
        document.body.clientHeight
      ) {
        // console.log("load more", loadingRef.current, pageRef.current);
        if (loadingRef.current) {
          return;
        }
        loadingRef.current = true;
        const { isEnd, list: paragraphs } = await fetchParagraphsService({
          captionId: id,
          page: pageRef.current,
        });
        loadingRef.current = false;
        pageRef.current += 1;
        setParagraphs((prev) => {
          return prev.concat(paragraphs);
        });
        if (isEnd) {
          document.removeEventListener("scroll", handler);
          return;
        }
      }
    }, 400);
    fetchCaptionAndSave(id).then(({ isEnd }) => {
      if (isEnd) {
        return;
      }
      document.addEventListener("scroll", handler);
    });
    pageRef.current = 1;
    return () => {
      document.removeEventListener("scroll", handler);
    };
  }, []);

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
  const updateText2 = useCallback(
    (updatedParagraph) => {
      return async (event) => {
        const { id, text2 } = updatedParagraph;
        const nextText2 = event.target.innerText;
        if (text2 === nextText2) {
          return;
        }
        await updateParagraphService({ id, text2: nextText2 });
      };
    },
    [paragraphs]
  );

  const deleteParagraph = useCallback(
    (deletedLine) => {
      return async () => {
        console.log("[]deleteParagraph ", caption);
        // const { paragraphs } = caption;
        const nextParagraphs = paragraphs.filter((paragraph) => {
          return paragraph.id !== deletedLine.id;
        });
        prevParagraphsRef.current = paragraphs;
        setParagraphs(nextParagraphs);
        await deleteParagraphService({ id: deletedLine.id });
        setDeletedParagraphsId(deletedLine.id);
      };
    },
    [caption, paragraphs]
  );
  const recoverDeletedParagraph = useCallback(async () => {
    await recoverParagraphService({ id: deletedParagraphId });
    setDeletedParagraphsId(null);
    if (prevParagraphsRef.current) {
      setParagraphs(prevParagraphsRef.current);
      prevParagraphsRef.current = null;
    }
  }, [deletedParagraphId]);

  const splitMergedLines = useCallback(
    (mergedLine) => {
      if (!caption) {
        return;
      }
      const nextOptimizedParagraphs = splitMergedParagraphs(
        caption.paragraphs,
        mergedLine
      );
      setCaption({
        ...caption,
        paragraphs: nextOptimizedParagraphs,
      });
    },
    [caption, caption]
  );
  const editCaption = useCallback(async () => {
    const savedCaption = await updateCaptionService({
      ...caption,
      paragraphs: caption.paragraphs.map((p) => {
        return {
          ...p,
          line: String(p.line),
        };
      }),
    });
  }, [caption]);

  if (!caption) {
    return null;
  }
  const { title } = caption;
  return (
    <div className="h-full">
      <Head>
        <title>{title}</title>
      </Head>
      <div className="relative dark:bg-gray-800">
        <div className="py-10 px-4 bg-gray-100 border-b">
          <div className="mx-auto md:px-60">
            <h2
              className="text-3xl break-all dark:text-gray-400"
              contentEditable
              suppressContentEditableWarning
              onBlur={updateTitle}
            >
              {title}
            </h2>
          </div>
        </div>
        <div className="mx-auto mt-20 px-4 space-y-6 pb-20 md:px-60">
          {paragraphs.map((paragraph) => {
            const { line, text1, text2 } = paragraph;
            return (
              <div
                key={line}
                className={cx(
                  "relative group",
                  String(line).includes("+")
                    ? "border-1 border-dashed border-gray-500"
                    : "",
                  !text2 ? "border-1 border-dashed border-red-500" : "",
                  "rounded-md"
                )}
              >
                <div className="absolute top-2 left-[-36px] hidden space-y-2 group-hover:block">
                  <p
                    className="text-sm px-2"
                    onClick={deleteParagraph(paragraph)}
                  >
                    <TrashIcon className="w-4 h-4 text-gray-500 cursor-pointer" />
                  </p>
                  <p
                    className={cx(
                      "text-sm px-2",
                      String(line).includes("+") ? "block" : "hidden"
                    )}
                    onClick={() => {
                      splitMergedLines(line);
                    }}
                  >
                    <TrashIcon className="w-4 h-4 text-gray-500 cursor-pointer" />
                  </p>
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
      <div className="fixed bottom-40 right-0 hidden space-y-4 md:block">
        <div
          className="group flex items-center py-2 px-4 rounded-l-lg bg-gray-100 cursor-pointer hover:bg-gray-200"
          onClick={editCaption}
        >
          <CogIcon className="w-6 h-6 text-gray-400 group-hover:text-gray-800" />
        </div>
      </div>
      {deletedParagraphId && (
        <FixedFooter>
          <div onClick={recoverDeletedParagraph}>撤销删除</div>
        </FixedFooter>
      )}
    </div>
  );
};

export default CaptionEditorPage;
