/**
 * @file 低难度字幕测验
 */
import { Fragment, useRef, useCallback, useEffect, useState } from "react";
import cx from "classnames";
import { useRouter } from "next/router";
import { Transition } from "@headlessui/react";
import {
  ArrowRightIcon,
  ChartBarIcon,
  FireIcon,
  LightBulbIcon,
  QuestionMarkCircleIcon,
  ReplyIcon,
  ScissorsIcon,
} from "@heroicons/react/outline";

import {
  createExamSpellingService,
  fetchExamService,
  updateExamService,
} from "@/services/exam";
import { fetchParagraphsService } from "@/services/caption";
import { SpellingResultType } from "@/domains/exam/constants";
import Exam, { ExamStatus } from "@/domains/exam";
import Loading from "@/components/Loading";
import Modal from "@/components/Modal";

const SimpleCaptionExamPage = () => {
  const router = useRouter();

  const examRef = useRef(null);
  const loadingRef = useRef(false);
  const startRef = useRef(null);
  const idRef = useRef<string>(null);
  const pageRef = useRef<number>(1);
  const moreRef = useRef([]);
  const totalRef = useRef(0);
  const [loading, setLoading] = useState(false);
  const [curCombo, setCurCombo] = useState(0);
  const [exam, setExam] = useState<Exam>(null);
  const [correctVisible, setCorrectVisible] = useState(false);
  const [incorrectVisible, setIncorrectVisible] = useState(false);
  const [text2, setText2] = useState(null);
  const [tipVisible, setTipVisible] = useState(false);

  useEffect(() => {
    pageRef.current = 1;
  }, []);

  const fetchParagraphs = useCallback(async () => {
    const response = await fetchParagraphsService({
      captionId: idRef.current,
      start: startRef.current,
      page: pageRef.current,
    });
    pageRef.current += 1;
    totalRef.current = response.total;
    return response.list;
  }, []);

  const init = useCallback(async () => {
    const { id } = router.query;
    const res = await fetchExamService({ id: id as string });
    const { captionId, status, combo, maxCombo, curParagraphId } = res;
    idRef.current = captionId;
    startRef.current = curParagraphId;
    const paragraphs = await fetchParagraphs();
    examRef.current = new Exam({
      title: "",
      status: ExamStatus.Started,
      combo,
      maxCombo,
      curParagraphId,
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
        const { combo, maxCombo, curParagraphId, remainingParagraphsCount } =
          nextExam;
        updateExamService({
          id,
          combo,
          maxCombo,
          curParagraphId,
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
      onCorrect({ combo, curParagraphId }) {
        setCorrectVisible(true);
        setCurCombo(combo);
        createExamSpellingService({
          examId: id,
          paragraphId: curParagraphId,
          type: SpellingResultType.Correct,
        });
        setTimeout(() => {
          setCorrectVisible(false);
        }, 800);
      },
      onIncorrect({ curParagraphId, inputtingWords }) {
        setIncorrectVisible(true);
        createExamSpellingService({
          examId: id,
          paragraphId: curParagraphId,
          type: SpellingResultType.Incorrect,
          input: inputtingWords.map((w) => w.word).join(" "),
        });
        setTimeout(() => {
          setIncorrectVisible(false);
        }, 800);
      },
      onSkip({ curParagraphId }) {
        createExamSpellingService({
          examId: id,
          paragraphId: curParagraphId,
          type: SpellingResultType.Skipped,
        });
      },
    });
    setExam(examRef.current.toJSON());
  }, []);

  useEffect(() => {
    init();
  }, []);

  const showText2 = useCallback((paragraph) => {
    return () => {
      setText2(paragraph.text2);
      setTipVisible(true);
    };
  }, []);

  console.log("[PAGE]exam/simple/[id] - render", exam);

  if (exam === null) {
    return null;
  }

  return (
    <div className="h-screen">
      {exam?.status === ExamStatus.Started && (
        <div className="relative h-full">
          {/* <div
            className="absolute left-4 top-4"
            onClick={showText2(exam.curParagraph)}
          >
            <QuestionMarkCircleIcon className="w-6 h-6 text-gray-500 cursor-pointer" />
          </div> */}
          <div className="py-8 px-4 text-xl text-gray-800 bg-gray-100 dark:text-white sm:px-0">
            <div className="sm:mx-auto sm:w-180">{exam.curParagraph.text1}</div>
          </div>
          <div className="py-6 px-4 sm:mx-auto sm:w-180 sm:px-0">
            <div className="text-3xl font-serif text-black dark:text-white min-h-36 dark:text-white">
              {(() => {
                const result = [];
                const elms = [...exam.inputtingWords];
                for (let i = 0; i < exam.curWords.length; i += 1) {
                  const [prefix, word, suffix] = exam.curWords[i];
                  let w = word;
                  if (word) {
                    w = elms.shift()?.word;
                  }
                  result.push(
                    <span key={i}>
                      {w ? prefix : ""}
                      {w}
                      {w ? suffix : ""}{" "}
                    </span>
                  );
                }
                return result;
              })()}
            </div>
          </div>
          <div className="min-h-48 px-4 sm:mx-auto sm:w-180 sm:px-0">
            <div className="flex flex-wrap h-full overflow-auto">
              {exam.displayedWords.map((segment) => {
                const { uid, word } = segment;
                const existing = exam.inputtingWords
                  .map((t) => t.uid)
                  .includes(uid);
                return (
                  <div
                    key={uid}
                    className={cx(
                      "inline mr-2 mb-2 px-4 py-1 text-white rounded-md bg-green-500 cursor-pointer hover:shadow",
                      existing ? "!bg-green-100 !hover:shadow-none" : ""
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
          <hr />
          <div className="flex items-center justify-between mt-6 px-4 sm:mx-auto sm:w-180 sm:px-0">
            <div className="text-xl text-gray-400">13/{totalRef.current}</div>
            <div className="flex space-x-4">
              <ChartBarIcon
                className="w-10 h-10 p-2 text-gray-500 rounded cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  if (!examRef.current) {
                    return;
                  }
                  examRef.current.clear();
                }}
              />
              <LightBulbIcon className="w-10 h-10 p-2 text-gray-500 rounded cursor-pointer hover:bg-gray-100" />
              <ScissorsIcon
                className="w-10 h-10 p-2 text-gray-500 rounded cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  if (!examRef.current) {
                    return;
                  }
                  examRef.current.skip();
                }}
              />
              <FireIcon
                className="w-10 h-10 p-2 text-gray-500 rounded cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  if (!examRef.current) {
                    return;
                  }
                  examRef.current.clear();
                }}
              />
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
        <div className="absolute right-10 top-16 transform -rotate-6">
          <p className="text-4xl text-green-500">CORRECT!</p>
          <p className="pr-4 text-right text-2xl text-yellow-500">
            x{curCombo}
          </p>
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
        <div className="absolute right-10 top-16 transform -rotate-6">
          <p className="text-4xl text-red-300">INCORRECT!</p>
        </div>
      </Transition>
      <Loading visible={loading} />
      <Modal
        visible={tipVisible}
        onCancel={() => {
          setTipVisible(false);
        }}
      >
        <div className="text-center">{text2}</div>
      </Modal>
    </div>
  );
};

export default SimpleCaptionExamPage;
