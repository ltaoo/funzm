/**
 * @file 官网首页
 */
import React, { useCallback, useRef, useState } from "react";
import cx from "classnames";
import { useRouter } from "next/router";
import {
  DocumentPdfIcon,
  DocumentDocxIcon,
  DocumentTxtIcon,
} from "@ltaoo/icons/outline";
import Head from "next/head";

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
        <div className="relative z-1 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28">
          <Head>
            <title>趣字幕 - 从有趣的字幕中学习英语</title>
          </Head>
          <SiteHeader user={user} />
          {/* wall */}
          <main className="relative mx-auto pt-10 px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
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
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <div className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-green-100 cursor-pointer hover:bg-green-200 md:py-4 md:text-lg md:px-10">
                    开始体验
                  </div>
                </div>
              </div>
            </div>
            <div className="#bg absolute z-5 inset-0">
              <div className="hidden absolute left-20 bottom-[-10px] w-30 h-30 bg-green-300 transform rotate-26 dark:bg-green-800 md:block"></div>
              <div className="hidden absolute right-20 top-10 w-20 h-20 bg-blue-400 rounded-full transform rotate-26 dark:bg-blue-600 md:block"></div>
            </div>
          </main>
        </div>
      </div>
      <div
        id="exp"
        className="pointer-group-hover:a mt-4 overflow-hidden sm:mt-6 lg:mt-8"
      >
        {/* 字幕解析、下载 */}
        <div className="#features p-4 py-8 xl:py-6 dark:bg-gray-700">
          <div className="text-center text-3xl text-gray-800 underline decoration-wavy decoration-green-500 underline-offset-6 dark:text-gray-200">
            &nbsp;&nbsp;这是一段美剧字幕&nbsp;&nbsp;
          </div>
          <div className="#example relative space-y-8 mt-10 py-2 px-2 rounded-xl md:shadow-xl md:shadow-green-800 md:px-8 md:mx-auto md:w-260 dark:shadow-gray-800">
            {caption.paragraphs.map((paragraph) => {
              const { text1, text2 } = paragraph;
              return (
                <div key={text1}>
                  <div className="text1">{text1}</div>
                  <div className="text2">{text2}</div>
                </div>
              );
            })}
            <div className="overflow-hidden pb-6">
              <p className="float-right italic text-gray-400">{caption.from}</p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <div className="inline-flex space-x-4 md:block">
              <Tooltip placement="bottom" content="下载 txt 文件">
                <DocumentTxtIcon
                  className="icon"
                  onClick={() => {
                    downloadTxt(caption);
                  }}
                />
              </Tooltip>
              <Tooltip placement="bottom" content="下载 docx 文件">
                <DocumentDocxIcon
                  className="icon"
                  onClick={() => {
                    downloadDocx(caption);
                  }}
                />
              </Tooltip>
              <Tooltip placement="bottom" content="下载 PDF（耗时较长）">
                <DocumentPdfIcon
                  className="icon"
                  onClick={() => {
                    downloadPdf(caption);
                  }}
                />
              </Tooltip>
              {/* <Tooltip placement="bottom" overlay={<div>改变字幕样式</div>}>
                <AdjustmentsIcon
                  className="icon"
                  onClick={updateParagraphStyles}
                />
              </Tooltip> */}
            </div>
          </div>
          <p className="block underline text-center text-gray-300">
            无需注册即可下载多种格式文档
          </p>
          {/* <div className="mt-36 text-center md:mx-auto md:w-260">
            <div className="inline-block text-3xl underline decoration-wavy decoration-green-500 underline-offset-6 dark:text-gray-200">
              &nbsp;&nbsp;或许，可以试试更难的...&nbsp;&nbsp;
            </div>
          </div> */}
        </div>
        {/* <div className="p-4 py-8 xl:py-10">
          <section className="flex justify-between w-80 min-h-80 sm:mx-auto sm:w-80 md:w-240">
            <div>
              <h3 className="#feature-title text-2xl sm:text-3xl dark:text-gray-200">
                生词本、错题本
              </h3>
              <div className="mt-8 ml-2 space-y-4">
                <p className="flex items-center text-lg sm:text-xl text-gray-500">
                  <VolumeUpIcon className="w-6 h-6 mr-4" />
                  原剧发音
                </p>
                <p className="flex items-center text-lg sm:text-xl text-gray-500">
                  <TranslateIcon className="w-6 h-6 mr-4" />
                  点击单词即可查询释义
                </p>
                <p className="flex items-center text-lg sm:text-xl text-gray-500">
                  <DocumentTextIcon className="w-6 h-6 mr-4" />
                  一键加入生词本
                </p>
              </div>
            </div>
            <div></div>
          </section>
        </div>
        <div className="p-4 py-8 xl:py-10">
          <section className="flex justify-between w-80 min-h-80 sm:mx-auto sm:w-80 md:w-240">
            <div className="#features">
              <h3 className="#feature-title text-2xl sm:text-3xl">
                测验模式加强字幕记忆
              </h3>
              <div className="mt-8 ml-2 space-y-4">
                <p className="flex items-center text-lg sm:text-xl text-gray-500">
                  <EmojiHappyIcon className="w-6 h-6 mr-4" />
                  简单模式有趣、轻松
                </p>
                <p className="flex items-center text-lg sm:text-xl text-gray-500">
                  <BookOpenIcon className="w-6 h-6 mr-4" />
                  专业模式高效、静心学习
                </p>
                <p className="flex items-center text-lg text-gray-500 sm:text-xl">
                  <ChartSquareBarIcon className="w-6 h-6 mr-4" />
                  统计测验结果
                </p>
              </div>
            </div>
            <div></div>
          </section>
        </div> */}
      </div>
      {/* <div className="block my-8 mx-4 py-8 px-4 rounded sm:mx-auto sm:w-180 sm:flex sm:items-center sm:justify-between ">
        <div className="mb-6 sm:mb-0">
          <div className="text-center text-3xl text-green-500 sm:text-4xl sm:text-left">
            更有趣的英语学习体验
          </div>
          <p className="mt-4 text-center text-gray-500 sm:text-left">
            为什么游戏让人沉迷，而学习不会，有没有让人沉迷的学习方式呢？
          </p>
          <p className="text-center text-gray-500 sm:text-left">
            抽卡、养成、Roguelike，只能是游戏吗？
          </p>
        </div>
        <div className="flex justify-center">
          <div className="inline py-2 px-4 text-green-500 rounded border-1 border-green-500 cursor-pointer">
            开启新学习
          </div>
        </div>
      </div> */}
      <div className="min-h-36 dark:bg-gray-700"></div>
      <div className="flex py-32 items-center justify-center">
        <a href="/user/login">
          <div className="inline-block py-2 px-4 text-green-500 rounded border-1 border-green-500 shadow-xl shadow-green-500 cursor-pointer">
            开始专属自己的字幕学习之旅吧
          </div>
        </a>
      </div>
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
            nickname: token.nickname,
            avatar: token.avatar,
          }
        : null,
    },
  };
};

export default Website;
