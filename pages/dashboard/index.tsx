/**
 * @file 个人中心
 */
import React, { useCallback, useEffect, useState } from "react";
import router from "next/router";

import { LocationMarkerIcon, UploadIcon } from "@ltaoo/icons/outline";

import Layout from "@/layouts";
import { getSession } from "@/next-auth/client";
import { parseCaptionContent } from "@/domains/caption";
import CaptionCard from "@/components/CaptionCard";
import CaptionUpload from "@/components/CaptionFileUpload";
import FakeCaptionCard from "@/components/CaptionCard/sk";
import { addCaptionService, fetchCaptionsService } from "@/services/caption";
import { checkInService } from "@/services";

const Dashboard = (props) => {
  const { user, dataSource = [] } = props;

  const [captions, setCaptions] = useState(dataSource);

  const refresh = useCallback(async () => {
    const nextCaptions = await fetchCaptionsService({ pageSize: 5 });
    // @ts-ignore
    setCaptions(nextCaptions.list);
  }, []);

  useEffect(() => {
    refresh();
  }, []);

  const checkIn = useCallback(async () => {
    try {
      const res = await checkInService();
      alert(`签到成功，获得${res.msg}`);
    } catch (err) {
      alert(err.message);
    }
  }, []);

  if (user === null) {
    return (
      <div className="mx-auto w-40 mt-10 text-center">
        <p className="">您还未登录</p>
        <button
          className="mt-2"
          onClick={() => {
            router.push({
              pathname: "/user/login",
            });
          }}
        >
          前往登录
        </button>
        <div>
          <button
            className="mt-2"
            onClick={() => {
              router.push({
                pathname: "/",
              });
            }}
          >
            首页
          </button>
        </div>
      </div>
    );
  }
  return (
    <Layout>
      <div className="min-h-screen">
        <header className="">
          <div className="relative flex space-x-4">
            <div
              className="flex-1 overflow-hidden relative px-4 py-2 bg-white rounded shadow"
              onClick={checkIn}
            >
              <div className="flex items-center justify-between text-gray-800">
                <div>
                  <p className="text-xm text-gray-500">签到</p>
                </div>
                <LocationMarkerIcon className="absolute -bottom-2 -right-2 w-14 h-14 text-gray-100" />
              </div>
            </div>
            <div className="flex-1 overflow-hidden relative px-4 py-2 bg-white rounded shadow">
              <CaptionUpload
                onChange={async (caption) => {
                  const { title, content, type } = caption;
                  const p = await parseCaptionContent(content, type);
                  const { id } = await addCaptionService({
                    title,
                    type,
                    paragraphs: p.map((p) => {
                      return {
                        ...p,
                        line: String(p.line),
                      };
                    }),
                  });
                  router.push({ pathname: `/captions/${id}` });
                }}
              >
                <div className="flex items-center justify-between text-gray-800">
                  <div>
                    <p className="text-xm text-gray-500">上传</p>
                  </div>
                  <UploadIcon className="absolute -bottom-2 -right-2 w-14 h-14 text-gray-100" />
                </div>
              </CaptionUpload>
            </div>
          </div>
        </header>
        <main>
          <div className="mt-8 text-center text-gray-800">我的字幕</div>
          <div className="mt-2">
            <div className="space-y-4 sm:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
              {captions.length > 0 ? (
                captions.map((caption) => {
                  const { id } = caption;
                  return (
                    <CaptionCard key={id} {...caption} onDelete={refresh} />
                  );
                })
              ) : (
                <>
                  <FakeCaptionCard />
                  <FakeCaptionCard />
                  <FakeCaptionCard />
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  return {
    props: {
      user: session?.user ?? null,
    },
  };
};

export default Dashboard;
