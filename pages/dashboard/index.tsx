/**
 * @file 个人中心
 */
import React, { Fragment } from "react";
import cx from "classnames";
import router from "next/router";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";

import Layout from "@/layouts";
import { getSession, signOut } from "@/next-auth/client";
import tmpCaptionStorage from "@/domains/caption/storage";
import { parseCaptionContent } from "@/domains/caption";
import { fetchCaptionsService } from "@/lib/caption";
import CaptionCard from "@/components/CaptionCard";
import CaptionUpload from "@/components/CaptionFileUpload";

const Dashboard = (props) => {
  const { user, dataSource = [] } = props;

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
            <CaptionUpload
              onChange={async (caption) => {
                const { title, content, type } = caption;
                const p = await parseCaptionContent(content, type);
                const captionResult = {
                  title,
                  paragraphs: p,
                };
                tmpCaptionStorage.save(captionResult);
                router.push({ pathname: "/captions/editor" });
              }}
            >
              上传
            </CaptionUpload>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* content */}
            <div className="space-y-4 sm:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
              {dataSource.map((caption) => {
                const { id } = caption;
                return <CaptionCard key={id} {...caption} />;
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
  const captions = await fetchCaptionsService({ pageSize: 5 }, session?.user);
  return {
    props: {
      user: session?.user ?? null,
      dataSource: captions,
    },
  };
};

export default Dashboard;
