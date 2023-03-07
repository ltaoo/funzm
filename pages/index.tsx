/**
 * @file 官网首页
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import cx from "classnames";
import { useRouter } from "next/router";
import {
  DocumentPdfIcon,
  DocumentDocxIcon,
  DocumentTxtIcon,
} from "@ltaoo/icons/outline";
import Head from "next/head";
import axios from "axios";

import { getToken } from "@/next-auth/jwt";
import { TOKEN_NAME } from "@/next-auth/constants";
import Footer from "@/layouts/site/footer";
import SiteHeader from "@/layouts/site/header";
import { localdb } from "@/utils/db";
import { downloadDocx, downloadPdf, downloadTxt } from "@/utils";
import Tooltip from "@/components/Tooltip";
import CaptionUpload from "@/components/CaptionFileUpload";

const Website = (props) => {
  const { u: user } = props;
  const router = useRouter();
  const loadingRef = useRef(false);

  // useEffect(() => {
  //   (() => {
  //     axios
  //       .get(
  //         "https://api.cefang.cn/tools/business-wechat/welcome/del-l?id=505",
  //         {
  //           // withCredentials: true,
  //           headers: {
  //           }
  //         }
  //       )
  //       .then((resp) => {
  //         console.log(resp);
  //       });
  //   })();
  // }, []);

  const [caption] = useState({
    title: "Young.Sheldon.S01E01.Pilot",
    paragraphs: [
      {
        id: 1,
        text1: "我一直喜欢火车",
        text2: "I've always loved trains.",
      },
      {
        id: 2,
        text1:
          "事实上，如果我在理论物理没有什么成果，我的后备计划是成为一个火车检票员",
        text2:
          "In fact, if my career in theoretical physics had't worked out, my backup plan was to become a professional ticket taker.",
      },
      {
        id: 3,
        text1: "或者是流浪汉",
        text2: "Or hobo.",
      },
      {
        id: 4,
        text1: "而当我发现火车能让我",
        text2: "And when I figured out that trains allowed me",
      },
    ],
    from: "--《Young Sheldon》S01.01",
  });

  const uploadFile = useCallback(async (caption) => {
    if (loadingRef.current) {
      return;
    }
    loadingRef.current = true;
    const id = await localdb.table("captions").add(caption);
    loadingRef.current = false;
    router.push({
      pathname: `/captions/@id${id}`,
    });
  }, []);

  // console.log("[PAGE]index - render", user);

  return (
    <div className="relative bg-white overflow-hidden dark:bg-gray-800">
      <div className="mx-auto">
        <div className="relative z-1 pb-8 sm:pb-16 md:pb-16 lg:w-full lg:pb-16">
          <Head>
            <title>趣字幕 - 从有趣的字幕中学习英语</title>
          </Head>
          <SiteHeader user={user} />
          {/* wall */}
          <main className="relative mx-auto pt-10 px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-16">
            <div className={cx("relative z-10 text-center")}>
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block text-8xl dark:text-gray-200">
                  趣字幕
                </span>
                <span className="block mt-8 text-green-600">
                  从有趣的字幕中学习英语
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:mx-auto md:mt-5 md:text-xl lg:mx-0 dark:text-gray-300">
                在线解析、查看字幕内容，自定义字幕文字样式，PC
                端、移动端字幕数据同步
              </p>
              <div className="mt-5 sm:mt-8 sm:flex justify-center">
                <div className="rounded-md shadow">
                  <CaptionUpload onChange={uploadFile}>
                    <div className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10">
                      上传字幕文件
                    </div>
                  </CaptionUpload>
                </div>
                {/* <div className="mt-3 sm:mt-0 sm:ml-3">
                  <div className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-green-100 cursor-pointer hover:bg-green-200 md:py-4 md:text-lg md:px-10">
                    开始体验
                  </div>
                </div> */}
              </div>
            </div>
            <div className="#bg absolute z-5 inset-0">
              <div className="hidden absolute left-20 bottom-[-10px] w-30 h-30 bg-green-300 transform rotate-26 dark:bg-green-800 md:block"></div>
              <div className="hidden absolute right-20 top-10 w-20 h-20 bg-blue-400 rounded-full transform rotate-26 dark:bg-blue-600 md:block"></div>
            </div>
          </main>
        </div>
      </div>
      <div id="exp" className="pointer-group-hover:a">
        {/* 字幕解析、下载 */}
        <div className="#features p-4 py-8 xl:py-6 dark:bg-gray-700"></div>
        <h2 className="text-3xl text-gray-800 text-center">字幕文件解析展示</h2>
        <div className="mt-8 px-24">
          <img
            className="w-full border border-solid border-gray-300 rounded-xl shadow-3xl"
            src="https://static.ltaoo.work/www.funzm.com_example.png"
          />
        </div>
        <div className="mt-24">
          <h2 className="text-3xl text-gray-800 text-center">
            高亮划线增加笔记
          </h2>
          <div className="mt-8 px-24">
            <img
              className="w-full border border-solid border-gray-300 rounded-xl shadow-3xl"
              src="https://static.ltaoo.work/funzm_note_profile.png"
            />
          </div>
        </div>
        <div className="mt-24">
          <h2 className="text-3xl text-gray-800 text-center">
            趣味「闯关」加深记忆
          </h2>
          <div className="mt-8 px-24">
            <img
              className="w-full border border-solid border-gray-300 rounded-xl shadow-3xl"
              src="https://static.ltaoo.work/www.funzm.com_scene.png"
            />
          </div>
        </div>
        <div className="mt-24">
          <h2 className="text-3xl text-gray-800 text-center">
            错误回顾反思与总结
          </h2>
          <div className="mt-8 px-24">
            <img
              className="w-full border border-solid border-gray-300 rounded-xl shadow-3xl"
              src="https://static.ltaoo.work/www.funzm.com_spellings.png"
            />
          </div>
        </div>
      </div>
      <div className="min-h-36 dark:bg-gray-700"></div>
      <Footer />
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const token = await getToken({
    req: context.req,
    cookieName: TOKEN_NAME,
  });
  return {
    props: {
      u: !!token
        ? {
            nickname: token.nickname || null,
            avatar: token.avatar || null,
          }
        : null,
    },
  };
};

export default Website;
