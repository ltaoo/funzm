/**
 * @file 个人中心
 */
import React, { useCallback, useState } from "react";
import router from "next/router";

import Layout from "@/layouts";
import { getSession } from "@/next-auth/client";
import { parseCaptionContent } from "@/domains/caption";
import { fetchCaptionsServer } from "@/lib/caption";
import CaptionCard from "@/components/CaptionCard";
import CaptionUpload from "@/components/CaptionFileUpload";
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

  const checkIn = useCallback(async () => {
    try {
      const res = await checkInService();
      console.log("签到成果，获得", res.msg);
      console.log(res);
    } catch (err) {
      // console.log(err, err.message);
      alert(err.message);
    }
  }, []);

  if (user === null) {
    return (
      <div className="mx-auto w-40 mt-10 text-center">
        <p className="">No Permission</p>
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
      </div>
    );
  }
  return (
    <Layout>
      <div className="min-h-full">
        <header className="bg-white shadow">
          <div className="flex justify-between max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex space-x-4">
              <p onClick={checkIn}>签到</p>
              <CaptionUpload
                onChange={async (caption) => {
                  const { title, content, type } = caption;
                  const p = await parseCaptionContent(content, type);
                  // const captionResult = {
                  //   title,
                  //   paragraphs: p,
                  // };
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
                上传
              </CaptionUpload>
            </div>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* content */}
            <div className="space-y-4 sm:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
              {captions.map((caption) => {
                const { id } = caption;
                return <CaptionCard key={id} {...caption} onDelete={refresh} />;
              })}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  const captions = await fetchCaptionsServer({ pageSize: 5 }, session?.user);
  return {
    props: {
      user: session?.user ?? null,
      dataSource: captions,
    },
  };
};

export default Dashboard;
