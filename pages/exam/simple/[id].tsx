/**
 * @file 低难度字幕测验
 */
import { Fragment, useRef, useCallback, useEffect, useState } from "react";
import cx from "classnames";
import { useRouter } from "next/router";

import { fetchParagraphsService } from "@/services/caption";
import Exam, { ExamStatus } from "@/domains/exam";
import { Transition } from "@headlessui/react";
import { fetchExamByCaptionId, updateExamService } from "@/services/exam";
import Loading from "@/components/Loading";

const SimpleCaptionExamPage = () => {
  const router = useRouter();

  const examRef = useRef(null);
  const loadingRef = useRef(false);
  const startRef = useRef(null);
  const idRef = useRef<string>(null);
  const pageRef = useRef<number>(1);
  const moreRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const [exam, setExam] = useState<Exam>(null);
  const [correctVisible, setCorrectVisible] = useState(false);
  const [incorrectVisible, setIncorrectVisible] = useState(false);

  const fetchParagraphs = useCallback(async () => {
    const response = await fetchParagraphsService({
      captionId: idRef.current,
      start: startRef.current,
      page: pageRef.current,
    });
    pageRef.current += 1;
    return response.list;
  }, []);

  const init = useCallback(async () => {
    const { id } = router.query;
    const res = await fetchExamByCaptionId({ id: id as string });
    const {
      captionId,
      status,
      combo,
      maxCombo,
      curParagraphId,
      skippedParagraphIds,
      correctParagraphIds,
      incorrectParagraphIds,
    } = res;
    idRef.current = captionId;
    startRef.current = curParagraphId;
    const paragraphs = await fetchParagraphs();
    examRef.current = new Exam({
      title: "",
      combo,
      maxCombo,
      status: ExamStatus.Started,
      curParagraphId,
      skippedParagraphs: skippedParagraphIds.split(",").map((id) => ({ id })),
      correctParagraphIds: correctParagraphIds.split(",").map((id) => ({ id })),
      incorrectParagraphIds: incorrectParagraphIds
        .split(",")
        .map((id) => ({ id })),
      paragraphs,
      onChange: async (nextExam) => {
        setExam(nextExam);
      },
      onBeforeNext({ remainingParagraphsCount }) {
        console.log(remainingParagraphsCount, loadingRef.current);
        if (remainingParagraphsCount === 1 && loadingRef.current) {
          alert("1 is loading data");
          return false;
        }
      },
      onBeforeSkip({ remainingParagraphsCount }) {
        console.log(remainingParagraphsCount, loadingRef.current);
        if (remainingParagraphsCount === 1 && loadingRef.current) {
          alert("2 is loading data");
          return false;
        }
      },
      onNext: async (nextExam) => {
        const {
          combo,
          maxCombo,
          curParagraphId,
          skippedParagraphs,
          correctParagraphs,
          incorrectParagraphs,
          remainingParagraphsCount,
        } = nextExam;
        // console.log("[]onNext", remainingParagraphsCount);
        updateExamService({
          id,
          combo,
          maxCombo,
          curParagraphId,
          skippedParagraphs,
          correctParagraphs,
          incorrectParagraphs,
        });
        if (remainingParagraphsCount === 3) {
          if (loadingRef.current) {
            console.log("has requested", loadingRef.current);
            return;
          }
          loadingRef.current = true;
          fetchParagraphs()
            .then((moreParagraphs) => {
              moreRef.current = moreParagraphs;
            })
            .finally(() => {
              loadingRef.current = false;
            });
        }
        if (remainingParagraphsCount === 1) {
          if (loadingRef.current) {
            // show loading to prevent user operate
            alert("is request data, please wait a minutes.");
            return;
          }
          if (moreRef.current.length !== 0) {
            examRef.current.appendParagraphs(moreRef.current);
            moreRef.current = [];
            return;
          }
        }
      },
      onCorrect(exam) {
        const { combo } = exam;
        console.log(`x${combo}`);
        setCorrectVisible(true);
        setTimeout(() => {
          setCorrectVisible(false);
        }, 800);
      },
      onIncorrect() {
        setIncorrectVisible(true);
        setTimeout(() => {
          setIncorrectVisible(false);
        }, 800);
      },
    });
    setExam(examRef.current.toJSON());
  }, []);

  useEffect(() => {
    init();
  }, []);

  // console.log("[PAGE]exam/simple/[id] - render", exam);

  if (exam === null) {
    return null;
  }

  return (
    <div className="h-screen bg-cool-gray-50 dark:bg-gray-800">
      {exam?.status === ExamStatus.Started && (
        <div className="h-full overflow-hidden pb-20 xl:mx-auto xl:w-180">
          <div className="mt-26 text-center dark:text-white">
            {exam.curParagraph.text1}
          </div>
          <div className="m-4 mx-2 min-h-30 dark:text-white">
            {exam.inputtingWords.map((p) => p.word).join(" ")}
          </div>
          <div className="min-h-36">
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
                      if (existing) {
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
                examRef.current.skip();
              }}
            >
              跳过
            </div>
            <div
              className="btn text-center !block"
              onClick={() => {
                // console.log(exam);
                setCorrectVisible(true);
                setTimeout(() => {
                  setCorrectVisible(false);
                }, 800);
              }}
            >
              结束
            </div>
          </div>
        </div>
      )}
      {exam?.status === ExamStatus.Completed && <div>完成</div>}
      <Transition
        show={correctVisible}
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enterTo="opacity-100 translate-y-0 sm:scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div className="absolute right-10 top-10 transform -rotate-6">
          <p className="text-4xl text-green-500">CORRECT!</p>
          {exam?.combo && (
            <p className="pr-4 text-right text-2xl text-yellow-500">
              x{exam?.combo}
            </p>
          )}
        </div>
      </Transition>
      <Transition
        show={incorrectVisible}
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enterTo="opacity-100 translate-y-0 sm:scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div className="absolute right-10 top-10 transform -rotate-6">
          <p className="text-4xl text-red-300">INCORRECT!</p>
          <span className="ml-4 text-green-500">x0</span>
        </div>
      </Transition>
      <Loading visible={loading} />
    </div>
  );
};

export default SimpleCaptionExamPage;
