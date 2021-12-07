/**
 * @file 低难度字幕测验
 */
import { useRef, useCallback, useEffect, useState, useMemo } from "react";
import cx from "classnames";
import Head from "next/head";
import { useRouter } from "next/router";

import {
  fetchCaptionWithoutParagraphs,
  fetchParagraphsService,
} from "@/services/caption";
import {
  compareLine,
  splitAndRandomTextSegments,
} from "@/domains/caption/utils";
import { IParagraph } from "@/domains/caption/types";

const SimpleCaptionExamPage = () => {
  const router = useRouter();

  const [count, steCount] = useState(0);
  const [caption, setCaption] = useState(null);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  // const [errorParagraphs, setErrorParagraphs] = useState([]);
  // const [skippedParagraphs, setSkippedParagraphs] = useState([]);
  const errorParagraphsRef = useRef([]);
  const skippedParagraphsRef = useRef([]);
  const [curLine, setCurLine] = useState(null);
  const idRef = useRef<string>(router.query.id as string);
  useEffect(() => {
    idRef.current = router.query.id as string;
  }, [router]);
  const pageRef = useRef<number>(1);
  const [curParagraphs, setCurParagraphs] = useState<{
    page: number;
    pageSize: number;
    total: number;
    list: IParagraph[];
  }>({
    page: 1,
    pageSize: 10,
    total: 0,
    list: [],
  });
  const inputtingRef = useRef([]);

  const fetchCaptionAndSave = useCallback(async (id) => {
    const response = await fetchCaptionWithoutParagraphs({ id });
    setCaption(response);
  }, []);

  const fetchParagraphs = useCallback(async () => {
    const response = await fetchParagraphsService({
      captionId: idRef.current,
      page: pageRef.current,
    });
    pageRef.current += 1;
    setCurParagraphs({
      ...response,
      list: response.list.filter(
        (paragraph) => !!paragraph.text2 && !!paragraph.text1
      ),
    });
  }, []);

  useEffect(() => {
    const { id } = router.query;
    fetchCaptionAndSave(id);
    fetchParagraphs();
  }, []);

  const startExam = useCallback(() => {
    setStarted(true);
    const paragraphs = curParagraphs.list;
    if (paragraphs.length > 0) {
      console.log("[PAGE]caption/review/simple - start exam", paragraphs);
      setCurLine(paragraphs[0].line);
    }
  }, [curParagraphs]);

  const nextParagraph = useCallback(() => {
    inputtingRef.current = [];
    const matchedIndex = curParagraphs.list.findIndex(
      (paragraph) => paragraph.line === curLine
    );
    console.log(
      "[PAGE]caption/review/simple - nextParagraph entry",
      curLine,
      matchedIndex,
      curParagraphs.list.length
    );
    if (matchedIndex + 3 >= curParagraphs.list.length) {
      pageRef.current += 1;
      fetchParagraphsService({
        captionId: idRef.current,
        page: pageRef.current,
      }).then((response) => {
        setCurParagraphs((prev) => {
          return {
            ...response,
            list: prev.list.concat(response.list),
          };
        });
      });
    }
    const nextParagraph = curParagraphs.list[matchedIndex + 1];
    console.log(
      "[PAGE]caption/review/simple - nextParagraph",
      nextParagraph,
      curLine
    );
    if (nextParagraph) {
      setCurLine(nextParagraph.line);
      return true;
    }
    return false;
  }, [curParagraphs, curLine]);

  const compareParagraph = useCallback(
    (curParagraph) => {
      if (!inputtingRef.current) {
        return;
      }
      if (
        curParagraph.text2.split(" ").length !== inputtingRef.current.length
      ) {
        return;
      }
      const inputting = inputtingRef.current.map((t) => t.text).join(" ");
      const diffNodes = compareLine(curParagraph.text2, inputting);
      console.log("[PAGE]caption/review/simple - diffNodes", diffNodes);
      if (diffNodes === null) {
        nextParagraph();
        return;
      }
      errorParagraphsRef.current = errorParagraphsRef.current.concat({
        ...curParagraph,
        error: inputting,
      });
      nextParagraph();
    },
    [nextParagraph, curParagraphs]
  );

  const { list: paragraphs } = curParagraphs;
  const curParagraph = paragraphs.find((p) => p.line === curLine);

  const segments = useMemo(() => {
    return splitAndRandomTextSegments(curParagraph?.text2);
  }, [curParagraph]);

  if (!caption) {
    return null;
  }

  const { title } = caption;

  console.log("[PAGE]review/simple/[id] - render", curParagraphs.list);

  return (
    <div className="h-screen bg-cool-gray-50 dark:bg-gray-800">
      <Head>
        <title>{caption.title}</title>
      </Head>
      {!started && (
        <div className="h-full overflow-hidden pb-20 xl:mx-auto xl:w-180">
          <div className="text-center">
            <h2 className="mt-6 px-4 text-2xl break-all text-black dark:text-white break-all">
              {title}
            </h2>
            <div className="mt-12 mx-auto w-80 p-4 bg-white rounded shadow-md">
              共{curParagraphs.total}句
            </div>
            <div className="mt-12 btn mx-auto" onClick={startExam}>
              开始
            </div>
          </div>
        </div>
      )}
      {started && (
        <div className="h-full overflow-hidden pb-20 xl:mx-auto xl:w-180">
          <div className="mt-26 text-center">{curParagraph.text1}</div>
          <div className="m-4 mx-2 min-h-30">
            {inputtingRef.current.map((p) => p.text).join(" ")}
          </div>
          <div className="min-h-40">
            <div className="flex flex-wrap h-full px-4 pt-2 overflow-auto">
              {segments.map((segment) => {
                const { uid, text } = segment;
                const existing = inputtingRef.current
                  .map((t) => t.uid)
                  .includes(uid);
                return (
                  <div
                    key={uid}
                    className={cx(
                      "inline mr-2 mb-2 px-4 py-1 text-white rounded-md bg-blue-500 cursor-pointer hover:shadow",
                      existing ? "!bg-blue-100 !hover:shadow-none" : ""
                    )}
                    onClick={() => {
                      if (existing) {
                        return;
                      }
                      inputtingRef.current =
                        inputtingRef.current.concat(segment);
                      steCount((prev) => prev + 1);
                      compareParagraph(curParagraph);
                    }}
                  >
                    {text}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="space-y-2">
            <div
              className="btn text-center !bg-gray-500 !block"
              onClick={() => {
                inputtingRef.current = [];
                steCount((prev) => prev + 1);
              }}
            >
              清空
            </div>
            <div
              className="btn text-center !block"
              onClick={() => {
                skippedParagraphsRef.current =
                  skippedParagraphsRef.current.concat(curParagraph);
                if (nextParagraph()) {
                  return;
                }
                setCompleted(true);
              }}
            >
              跳过
            </div>
            <div
              className="btn text-center !block"
              onClick={() => {
                console.log(errorParagraphsRef.current);
                console.log(skippedParagraphsRef.current);
                console.log(curParagraph);
              }}
            >
              结束
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleCaptionExamPage;
