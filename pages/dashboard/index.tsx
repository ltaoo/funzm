/**
 * @file 个人中心
 */
import React, { useCallback, useEffect, useState } from "react";
import router from "next/router";

import { CalendarIcon, PaperClipIcon, UploadIcon } from "@ltaoo/icons/outline";

import Layout from "@/layouts";
import { parseCaptionContent } from "@/domains/caption";
import CaptionCard from "@/components/CaptionCard";
import CaptionUpload from "@/components/CaptionFileUpload";
import FakeCaptionCard from "@/components/CaptionCard/sk";
import {
  addCaptionService,
  fetchCaptionsService,
} from "@/domains/caption/services";
import { ICaptionValues } from "@/domains/caption/types";
import CheckInInput from "@/components/CheckInInput";
import { hideLoading, showLoading } from "@/components/SpinModal";

const Dashboard = (props) => {
  const { dataSource = [] } = props;

  const [loading, setLoading] = useState(true);
  const [captions, setCaptions] = useState<ICaptionValues[]>(dataSource);

  const refresh = useCallback(async () => {
    setLoading(true);
    const nextCaptions = await fetchCaptionsService({ pageSize: 5 });
    setLoading(false);
    setCaptions(nextCaptions.list);
  }, []);

  useEffect(() => {
    refresh();
  }, []);

  const handleUploadCaption = useCallback(async (caption) => {
    showLoading({ title: "正在上传..." });
    const { title, content, type } = caption;
    const p = await parseCaptionContent(content, type);
    const { id } = await addCaptionService({
      title,
      paragraphs: p.map((p) => {
        return {
          ...p,
          line: String(p.line),
        };
      }),
    });
    await hideLoading();
    router.push({ pathname: `/captions/${id}` });
  }, []);

  return (
    <Layout title="首页">
      <div className="flex">
        <main className="flex-1 mr-12">
          <div className="">
            {/* <div className="text-2xl text-gray-800">进行中的测验</div> */}
            <div className="">
              {(() => {
                if (loading) {
                  return (
                    <>
                      <div className="mt-8 text-2xl text-gray-800">
                        我的字幕
                      </div>
                      <div className="mt-4 space-y-4">
                        <FakeCaptionCard />
                      </div>
                    </>
                  );
                }
                if (captions.length) {
                  return (
                    <>
                      <div className="mt-4 text-2xl text-gray-800">
                        我的字幕
                      </div>
                      <div className="mt-4 space-y-4">
                        {captions.map((caption) => {
                          const { id } = caption;
                          return (
                            <CaptionCard
                              key={id}
                              {...caption}
                              onDelete={refresh}
                            />
                          );
                        })}
                      </div>
                    </>
                  );
                }
                return (
                  <>
                    <div className="mt-8 text-2xl text-gray-800">我的字幕</div>
                    <CaptionUpload onChange={handleUploadCaption}>
                      <div className="flex items-center justify-center mt-8">
                        <div className="text-center">
                          <p className="text-center text-gray-500">暂无字幕</p>
                          <div className="space-x-4">
                            <div className="btn mt-4">点击添加字幕</div>
                          </div>
                        </div>
                      </div>
                    </CaptionUpload>
                  </>
                );
              })()}
            </div>
          </div>
        </main>
        <div className="w-80 px-8 border-l-1">
          <div>
            <div className="#check-in mt-2">
              <div className="flex items-center mb-2 text-gray-800">
                <CalendarIcon className="w-5 h-5 mr-2 text-gray-800" />
                <span>签到</span>
              </div>
              <CheckInInput />
            </div>
            <div className="mt-8">
              <div className="flex items-center mb-2 text-gray-800">
                <PaperClipIcon className="w-5 h-5 mr-2 text-gray-800" />
                <span>工具栏</span>
              </div>
              <div className="mt-2 py-4 px-6 relative flex space-x-4 rounded-xl shadow bg-gray-800">
                <CaptionUpload onChange={handleUploadCaption}>
                  <UploadIcon className="w-6 h-6 text-gray-100" />
                </CaptionUpload>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
