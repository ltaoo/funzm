/**
 * @file 字幕关卡进度
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { IExamProgressRes } from "@/domains/exam/types";
import { useRouter } from "next/router";

import {
  LightningBoltIcon,
  MicrophoneIcon,
  PencilAltIcon,
  StarIcon,
} from "@ltaoo/icons/outline";

import {
  fetchExamProgressService,
  replayExamScene,
} from "@/domains/exam/services";
import Layout from "@/layouts";
import { ExamType, ExamTypePathMap } from "@/domains/exam/constants";

const CaptionProgressPage = () => {
  const [initial, setInitial] = useState(true);
  const [progresses, setProgresses] = useState<IExamProgressRes[]>([]);

  const router = useRouter();
  const caption_id = router.query.id as string;

  useEffect(() => {
    // Taro.getCurrentInstance().router.params;
    if (!caption_id) {
      return;
    }
    (async () => {
      const resp = await fetchExamProgressService({
        caption_id: caption_id,
      });
      setInitial(false);
      setProgresses(resp);
    })();
  }, [caption_id]);

  const startExamScene = useCallback(
    (type, { id }) => {
      return async () => {
        const created = await replayExamScene({
          id,
          type,
        });
        const p = ExamTypePathMap[created.type];
        router.push({
          pathname: `/exam/${p}/${created.id}`,
        });
      };
    },
    [caption_id]
  );

  const content = useMemo(() => {
    if (initial) {
      return (
        <div className="mt-6">
          <div className="mt-6">
            <div className="relative flex items-center py-4 px-6 mb-1 rounded bg-gray-100">
              <div className="flex flex-col items-center w-8 h-4 text-3xl text-gray-500"></div>
              <div className="ml-4">
                <div>
                  <div className="h-4 text-gray-500"></div>
                  <div className="h-6 text-xl text-gray-500"></div>
                </div>
              </div>
            </div>
            <div className="inline-flex items-center mt-2 px-4 py-1 rounded-xl bg-gray-800">
              <div className="w-6 h-6" />
              <div className="ml-2 w-6 h-6" />
              <div className="ml-2 w-6 h-6" />
            </div>
          </div>
        </div>
      );
    }
    if (progresses.length === 0) {
      return (
        <div className="mt-6">
          <div className="mt-4 text-center text-gray-800">还没有进行过关卡</div>
          <div className="mt-4 text-center">
            <div
              className="inline-block py-2 px-4 text-gray-100 bg-gray-800 rounded shadow"
              onClick={() => {
                router.push({
                  pathname: `/exam/prepare/${caption_id}`,
                });
              }}
            >
              前往关卡
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="mt-6">
        {progresses.map((pg) => {
          const { scene_id, index, start, prefect } = pg;
          return (
            <div
              className="mt-6"
              //       onClick={() => {
              //         router.push({
              //           pathname: `/pages/exam/progress/detail/index?id=${scene_id}`,
              //         });
              //       }}
            >
              <div
                key={index}
                className="relative flex items-center py-4 px-6 mb-1 rounded bg-gray-100"
              >
                <div className="flex flex-col items-center w-8 text-3xl text-gray-500">
                  {index}
                  {prefect && (
                    <StarIcon className="mt-1 w-6 h-6" color="#f8ca4f" />
                  )}
                </div>
                <div className="ml-4">
                  <div>
                    <div className="text-gray-500">{start.text1}</div>
                    <div className="text-xl text-gray-500">{start.text2}</div>
                  </div>
                </div>
              </div>
              <div className="inline-flex items-center mt-2 px-4 py-2 rounded-xl bg-gray-800 space-x-2">
                <LightningBoltIcon
                  className="w-6 h-6 text-gray-100 cursor-pointer"
                  onClick={startExamScene(ExamType.Selection, { id: scene_id })}
                />
                <PencilAltIcon
                  className="w-6 h-6 text-gray-100 cursor-pointer"
                  onClick={startExamScene(ExamType.Spelling, { id: scene_id })}
                />
                <MicrophoneIcon
                  className="w-6 h-6 text-gray-100 cursor-pointer"
                  onClick={() => {
                    alert("口语模式正在开发中");
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [initial, progresses, caption_id]);

  return (
    <Layout title="关卡进度">
      <div className="page mt-4 px-4 pb-8">
        <div className="text-3xl text-gray-800">关卡进度</div>
        {content}
      </div>
    </Layout>
  );
};

export default CaptionProgressPage;
