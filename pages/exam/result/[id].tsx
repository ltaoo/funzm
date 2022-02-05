/**
 * @file 关卡结果
 */
import { useCallback, useEffect, useState } from "react";
import cx from "classnames";
import { useRouter } from "next/router";

import {
  fetchPreparedExamSceneService,
  fetchExamSceneProfileService,
  replayExamScene,
} from "@/domains/exam/services";
import { ExamStatus, SpellingResultType } from "@/domains/exam/constants";
import SimpleExamStats from "@/components/SimpleExamStats";
import {
  ArrowRightIcon,
  CheckIcon,
  ReplyIcon,
  XIcon,
} from "@ltaoo/icons/outline";
import IconWithTxt from "@/components/IconWithTxt";
import { IExamSceneValues } from "@/domains/exam/types";
import Layout from "@/layouts";
import { getMatchedPagePath } from "@/domains/exam/utils";
import Paragraphs from "@/components/Paragraphs";

const ExamSceneResultPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const [examScene, setExamScene] = useState<IExamSceneValues>(null);
  const [cur, setCur] = useState(SpellingResultType.Incorrect);

  const init = useCallback(async (id) => {
    const resp = await fetchExamSceneProfileService({ id });
    setExamScene(resp);
  }, []);

  useEffect(() => {
    init(id);
  }, [id]);

  const nextExamScene = useCallback(async () => {
    const { captionId } = examScene;
    const { id: i, type: t } = await fetchPreparedExamSceneService({
      captionId,
    });
    const path = getMatchedPagePath(t);
    router.push({
      pathname: `/exam/${path}/${i}`,
    });
  }, [examScene]);

  const replay = useCallback(async () => {
    if (examScene === null) {
      alert("异常操作，请等待页面加载完成");
      return;
    }
    const { id: i, type: t } = await replayExamScene({
      id,
    });
    const path = getMatchedPagePath(t);
    router.push({
      pathname: `/exam/${path}/${i}`,
    });
  }, [examScene]);

  console.log('[PAGE]exam/result/[id] - render', examScene?.incorrectParagraphs);

  if (examScene === null) {
    return null;
  }

  return (
    <Layout title="测验结果">
      <div className="flex">
        <div className="flex-1 mr-12 mt-4">
          <div className="flex justify-center py-4 text-3xl">
            <div className="inline-flex items-center">
              {examScene.status === ExamStatus.Completed && (
                <CheckIcon className="w-10 h-10 text-green-500" />
              )}
              {examScene.status === ExamStatus.Failed && (
                <XIcon className="w-10 h-10 text-red-500" />
              )}
              <span
                className={cx(
                  "inline-block mx-4",
                  examScene.status === ExamStatus.Completed
                    ? "text-green-500"
                    : "text-red-500"
                )}
              >
                {examScene.status === ExamStatus.Completed ? "完成" : "失败"}
              </span>
            </div>
          </div>
          <div className="mt-6 py-4 bg-gray-100 rounded-xl shadow">
            <SimpleExamStats data={examScene} />
          </div>
          <div className="inline-flex mt-10 py-2 px-4 space-x-4 bg-gray-800 rounded-xl shadow-xl">
            <IconWithTxt
              className="text-gray-200"
              icon={ReplyIcon}
              onClick={replay}
            ></IconWithTxt>
            {examScene.status === ExamStatus.Completed && !examScene.noMore && (
              <IconWithTxt
                className="text-gray-200"
                icon={ArrowRightIcon}
                onClick={nextExamScene}
              ></IconWithTxt>
            )}
          </div>
          <div className="mt-8 relative">
            <div
              className={cx(
                "flex rounded-xl py-2 px-2 border-solid border border-gray-200 bg-gray-100"
              )}
            >
              <div
                className={cx(
                  "relative z-index-10 py-2 rounded-xl w-24 text-center",
                  cur === SpellingResultType.Incorrect
                    ? "text-gray-200 bg-gray-800"
                    : " text-gray-800"
                )}
                onClick={() => {
                  setCur(SpellingResultType.Incorrect);
                }}
              >
                错误
              </div>
              <div
                className={cx(
                  "relative z-index-10 py-2 rounded-xl w-24 text-center",
                  cur === SpellingResultType.Remaining
                    ? "text-gray-200 bg-gray-800"
                    : " text-gray-800"
                )}
                onClick={() => {
                  setCur(SpellingResultType.Remaining);
                }}
              >
                剩余
              </div>
              <div
                className={cx(
                  "relative z-index-10 py-2 rounded-xl w-24 text-center",
                  cur === SpellingResultType.Skipped
                    ? "text-gray-200 bg-gray-800"
                    : " text-gray-800"
                )}
                onClick={() => {
                  setCur(SpellingResultType.Skipped);
                }}
              >
                跳过
              </div>
              <div
                className={cx(
                  "relative z-index-10 py-2 rounded-xl w-24 text-center",
                  cur === SpellingResultType.Correct
                    ? "text-gray-200 bg-gray-800"
                    : " text-gray-800"
                )}
                onClick={() => {
                  setCur(SpellingResultType.Correct);
                }}
              >
                正确
              </div>
            </div>
          </div>
          <div className="mt-2 py-4 px-2 text-left">
            <div
              className={cx(
                cur === SpellingResultType.Incorrect ? "block" : "hidden"
              )}
            >
              <Paragraphs dataSource={examScene.incorrectParagraphs} />
            </div>
            <div
              className={cx(
                cur === SpellingResultType.Skipped ? "block" : "hidden"
              )}
            >
              <Paragraphs dataSource={examScene.skippedParagraphs} />
            </div>
            <div
              className={cx(
                cur === SpellingResultType.Remaining ? "block" : "hidden"
              )}
            >
              <Paragraphs dataSource={examScene.remainingParagraphs} />
            </div>
            <div
              className={cx(
                cur === SpellingResultType.Correct ? "block" : "hidden"
              )}
            >
              <Paragraphs dataSource={examScene.correctParagraphs} />
            </div>
          </div>
        </div>
        <div className="w-80"></div>
      </div>
    </Layout>
  );
};

export default ExamSceneResultPage;
