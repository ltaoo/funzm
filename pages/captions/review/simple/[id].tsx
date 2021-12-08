/**
 * @file 低难度字幕测验
 */
import { useRef, useCallback, useEffect, useState } from "react";
import cx from "classnames";
import Head from "next/head";
import { useRouter } from "next/router";

import {
  fetchCaptionWithoutParagraphs,
  fetchParagraphsService,
} from "@/services/caption";
import Exam, { ExamStatus } from "@/domains/exam";

const SimpleCaptionExamPage = () => {
  const router = useRouter();

  const examRef = useRef(null);
  const [exam, setExam] = useState<Exam>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    examRef.current = new Exam({
      title: "",
      paragraphs: [],
      onChange: async (nextExam) => {
        const { curParagraph, paragraphs } = nextExam;
        const index = paragraphs.findIndex((p) => p.id === curParagraph.id);
        console.log(
          "[PAGE]caption/exam/simple - onChange",
          index,
          paragraphs.length
        );
        if (index !== -1 && index + 3 >= paragraphs.length) {
          loadingRef.current = true;
          const moreParagraphs = await fetchParagraphs();
          loadingRef.current = false;
          examRef.current.appendParagraphs(moreParagraphs);
        }
        setExam(nextExam);
      },
    });
  }, []);

  const [caption, setCaption] = useState(null);
  const idRef = useRef<string>(router.query.id as string);
  useEffect(() => {
    idRef.current = router.query.id as string;
  }, [router]);
  const pageRef = useRef<number>(1);

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
    return response.list;
  }, []);

  useEffect(() => {
    const { id } = router.query;
    fetchCaptionAndSave(id);
  }, []);

  const startExam = useCallback(async () => {
    if (!examRef.current) {
      return;
    }
    const paragraphs = await fetchParagraphs();
    examRef.current.start(paragraphs);
  }, []);

  if (!caption) {
    return null;
  }

  const { title } = caption;

  // console.log("[PAGE]review/simple/[id] - render", exam);

  return (
    <div className="h-screen bg-cool-gray-50 dark:bg-gray-800">
      <Head>
        <title>{caption.title}</title>
      </Head>
      {exam === null && (
        <div className="h-full overflow-hidden pb-20 xl:mx-auto xl:w-180">
          <div className="text-center">
            <h2 className="mt-6 px-4 text-2xl break-all text-black dark:text-white break-all">
              {title}
            </h2>
            <div className="mt-12 mx-auto w-80 p-4 bg-white rounded shadow-md">
              共345句
            </div>
            <div className="mt-12 btn mx-auto" onClick={startExam}>
              开始
            </div>
          </div>
        </div>
      )}
      {exam?.status === ExamStatus.Started && (
        <div className="h-full overflow-hidden pb-20 xl:mx-auto xl:w-180">
          <div className="mt-26 text-center">{exam.curParagraph.text1}</div>
          <div className="m-4 mx-2 min-h-30">
            {exam.inputtingWords.map((p) => p.word).join(" ")}
          </div>
          <div className="min-h-40">
            <div className="flex flex-wrap h-full px-4 pt-2 overflow-auto">
              {exam.displayedWords.map((segment) => {
                const { uid, word } = segment;
                const existing = exam.inputtingWords
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
                      if (!examRef.current) {
                        return;
                      }
                      examRef.current.write(segment);
                    }}
                  >
                    {word}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="space-y-2">
            <div
              className="btn text-center !bg-gray-500 !block"
              onClick={() => {
                if (!examRef.current) {
                  return;
                }
                examRef.current.clear();
              }}
            >
              清空
            </div>
            <div
              className="btn text-center !block"
              onClick={() => {
                if (!examRef.current) {
                  return;
                }
                if (loadingRef.current) {
                  return;
                }
                examRef.current.skip();
              }}
            >
              跳过
            </div>
            <div
              className="btn text-center !block"
              onClick={() => {
                console.log(exam);
              }}
            >
              结束
            </div>
          </div>
        </div>
      )}
      {exam?.status === ExamStatus.Completed && <div>完成</div>}
    </div>
  );
};

export default SimpleCaptionExamPage;
