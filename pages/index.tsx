/**
 * @file 官网首页
 */

import React, { Fragment, useCallback, useState } from "react";
import cx from "classnames";
import { useRouter } from "next/router";
import { Popover, Transition } from "@headlessui/react";
import {
  AdjustmentsIcon,
  BookOpenIcon,
  ChartSquareBarIcon,
  DeviceMobileIcon,
  DocumentTextIcon,
  DownloadIcon,
  EmojiHappyIcon,
  MenuIcon,
  MoonIcon,
  PencilIcon,
  SunIcon,
  TranslateIcon,
  UploadIcon,
  UserIcon,
  VolumeUpIcon,
  XIcon,
} from "@heroicons/react/outline";

import captionTmpStorage from "@/domains/caption/storage";
import CaptionUpload from "@/components/CaptionFileUpload";
import { getSession, useSession } from "@/next-auth/client";

import Layout from "@/layouts";

const navigation = [
  { name: "功能", href: "#" },
  { name: "订阅", href: "#" },
  { name: "帮助中心", href: "#" },
  { name: "关于我们", href: "#about" },
];

const Website = (props) => {
  const { user } = props;
  const router = useRouter();
  const session = useSession();

  // const user = session?.user;
  // console.log("[PAGE]Website - render", user);

  const uploadFile = useCallback(async (caption) => {
    captionTmpStorage.save(caption);
    router.push({
      pathname: "/captions/editor",
    });
  }, []);

  return (
    <div className="relative bg-white overflow-hidden">
      <div className="mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:w-full lg:pb-28">
          <Popover className="header">
            <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
              <nav
                className="relative flex items-center justify-between sm:h-10"
                aria-label="Global"
              >
                <div className="logo flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
                  <div className="flex items-center justify-between w-full md:w-auto">
                    <a href="#">
                      <span className="sr-only">FunZM</span>
                      <img
                        className="h-8 w-auto sm:h-10"
                        src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                      />
                    </a>
                    <div className="-mr-2 flex items-center md:hidden">
                      <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                        <span className="sr-only">Open main menu</span>
                        <MenuIcon className="h-6 w-6" aria-hidden="true" />
                      </Popover.Button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center hidden md:block md:ml-10 md:pr-4 md:space-x-8">
                  {navigation.map((item) => (
                    <div
                      key={item.name}
                      className="inline font-medium text-gray-500 cursor-pointer hover:text-gray-900"
                    >
                      {item.name}
                    </div>
                  ))}
                  {user ? (
                    <div
                      className="inline-flex rounded bg-gray-100 p-2 px-4 items-center font-medium text-green-600 cursor-pointer hover:text-green-500"
                      onClick={() => {
                        router.push({
                          pathname: "/dashboard",
                        });
                      }}
                    >
                      个人中心
                    </div>
                  ) : (
                    <div
                      className="inline font-medium text-green-600 cursor-pointer hover:text-green-500"
                      onClick={() => {
                        router.push({
                          pathname: "/user/login",
                        });
                      }}
                    >
                      登录
                    </div>
                  )}
                </div>
              </nav>
            </div>
            <Transition
              as={Fragment}
              enter="duration-150 ease-out"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="duration-100 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Popover.Panel
                focus
                className="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
              >
                <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden">
                  <div>
                    <div className="px-5 pt-4 flex items-center justify-between">
                      <div>
                        <img
                          className="h-8 w-auto"
                          src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                          alt=""
                        />
                      </div>
                      <div className="-mr-2">
                        <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                          <span className="sr-only">Close main menu</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </Popover.Button>
                      </div>
                    </div>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                  <div
                    className="block w-full px-5 py-3 text-center font-medium text-green-600 bg-gray-50 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      router.push({
                        pathname: user ? "/dashboard" : "/user/login",
                      });
                    }}
                  >
                    {user ? "个人中心" : "登录"}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>
          {/* wall */}
          <main className="mx-auto pt-10 px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
            <div className={cx("text-center")}>
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">趣字幕</span>{" "}
                <span className="block mt-2 text-green-600 xl:inline">
                  从有趣的字幕中学习英语
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                支持上传字幕解析、下载。在线查看字幕内容，分语言自定义字幕文字样式、大小。PC
                端、移动端同步。
              </p>
              <p className="text-base text-gray-500 sm:text-lg sm:mx-auto md:text-xl lg:mx-0">
                复习测验功能，帮助深入记忆字幕内容，提高学习效率
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
                  <div className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 md:py-4 md:text-lg md:px-10">
                    实际体验
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="mt-4 overflow-hidden sm:mt-6 lg:mt-10">
        {/* 关于 */}
        <section className="p-4 py-10 bg-gray-100">
          <div className="mx-auto lg:w-240">
            <h2 className="text-xl text-center sm:text-2xl md:text-2xl lg:text-2xl">
              我怎么理解「学好」英语？
            </h2>
            <div className="mt-4 space-y-1">
              <p className="text-gray-600">
                想和大家聊一聊，怎么才能学好英语。
              </p>
              <p className="text-gray-600">
                首先我们要搞清楚，你的「学好」是指什么，流利地日常沟通？看懂英语文档？还是能胜任专业的英语翻译。不同的目的，需要有不同的学习方式，来达到我们希望的「学好」。
              </p>
              <p className="text-gray-600">
                我作为一个前端开发，之前希望的「学好」就是能看懂英文技术文档，这其实不难，遇到不会的单词查一查，长句子就直接丢进翻译软件，磕磕绊绊地也能看懂，而且熟练之后，大部分单词和句型也能记住，不借助翻译软件也是能完整看完一篇技术文档、技术博客之类的。
              </p>
              <p className="text-gray-600">
                我也一直满足于这种程度，直到我遇到一个技术问题，需要在
                Github（一个代码托管平台，在这里可以和全世界的程序员交流）上和别人沟通，虽然我能看懂他们的日常沟通，但需要自己写时，写出的「句子」自己能看懂，别人能不能看懂就不知道了。
              </p>
              <p className="text-gray-600">
                这时我希望的「学好」英语，就变成能够写出自然的英语句子，也就是从开始的「读」，到现在的「读、写」。
              </p>
              <p className="text-gray-600">
                经过一些搜索，我意识到通过「语料」是一个比较好的方式，于是我每天背一些句子。但效果并不明显，我总是背完就忘记了。
              </p>
              <p className="text-gray-600">
                我觉得我需要一个「情景化」、「生活化」的场景，我把目标看向了美剧。
              </p>
              <p className="text-gray-600">
                各种情景、真实世界、母语发音、中英对照，还有什么比这更有效的吗？
              </p>
              <p className="text-gray-600">
                我下载了我的第一部美剧，《小谢尔顿》，因为觉得也许小孩说英语会更简单，毕竟他们词汇量还没有成人的大。
              </p>
              <p className="text-gray-600">
                当然，有一点是我从始至终都坚持的，不「痛苦」的学习是无效的，看美剧很快乐，看完后还能记得多少呢，情节或许还能记住，具体的对话内容呢，还能记住多少？
              </p>
              <p className="text-gray-600">
                所以我在看完美剧后，要求能够将中文台词翻译成英文，毕竟我的最终目的就是能够将自己的想法（中文）翻译成英文。
              </p>
              <p className="text-gray-600">
                这个网站就是为了完成这件事的，我可以将原始中英字幕导入，在方便我随时背句子的同时，它提供了「测验」功能，分为简单和困难两种模式。
              </p>
              <p className="text-gray-600">
                简单模式下，会按顺序显示中文字幕，下面提供单词选项，点击单词组成句子，与原句进行对比。
              </p>
              <p className="text-gray-600">
                专业模式就是单纯的「默写」了，给出所有的中文字幕，在中文下填入翻译内容，同样与原句进行对比。
              </p>
              <p className="text-gray-600">
                本来只有专业模式的，但实在是太困难了，简单句子还好，复杂句子即使我看过原文，还是翻译不出来。以及移动端输入内容不方便，所以又增加了简单模式，方便我在碎片时间也能翻译上几句。
              </p>
              <p className="text-gray-600">
                最后说说效果，这有自卖自夸的嫌疑，但通过这种「预习」、「考试」的模式，的确能记住大部分字幕，还能知道一些口语化的表达，比如「关你屁事」，可以用
                `None of your business.`
              </p>
              <p className="text-gray-600"></p>
            </div>
          </div>
        </section>
        {/* 网站功能 */}
        <div className="p-4 py-8 xl:py-10">
          {/* 字幕解析、下载 */}
          <section className="flex justify-between w-80 min-h-80 sm:mx-auto sm:w-80 md:w-240">
            <div className="">
              <h3 className="text-2xl sm:text-3xl">字幕解析与下载</h3>
              <div className="mt-8 ml-2 space-y-4">
                <p className="flex items-center text-lg sm:text-xl text-gray-500">
                  <UploadIcon className="w-6 h-6 mr-4 text-green-500" />
                  支持 ass、srt 等格式
                </p>
                <p className="flex items-center text-lg sm:text-xl text-gray-500">
                  <DownloadIcon className="w-6 h-6 mr-4 text-green-500" />
                  导出为 text、word、pdf 等格式
                </p>
              </div>
            </div>
            <div></div>
          </section>
        </div>
        <div className="p-4 py-8 bg-gray-100 xl:py-10">
          {/* PC、移动端同步 */}
          <section className="flex justify-between w-80 min-h-80 sm:mx-auto sm:w-80 md:w-240">
            <div className="">
              <h3 className="text-2xl sm:text-3xl">随时查看字幕</h3>
              <div className="mt-8 ml-2 space-y-4">
                <p className="flex items-center text-lg sm:text-xl text-gray-500">
                  <DeviceMobileIcon className="w-6 h-6 mr-4" />
                  支持 PC 和移动端
                </p>
                <p className="flex items-center text-lg sm:text-xl text-gray-500">
                  <AdjustmentsIcon className="w-6 h-6 mr-4" />
                  自定义字幕字体样式、大小
                </p>
                <p className="flex items-center text-lg sm:text-xl text-gray-500">
                  <MoonIcon className="w-6 h-6 mr-4" />
                  支持暗黑模式
                </p>
              </div>
            </div>
            <div></div>
          </section>
        </div>
        <div className="p-4 py-8 xl:py-10">
          {/* PC、移动端同步 */}
          <section className="flex justify-between w-80 min-h-80 sm:mx-auto sm:w-80 md:w-240">
            <div>
              <h3 className="text-2xl sm:text-3xl">生词本、错题本</h3>
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
        <div className="p-4 py-8 bg-gray-100 xl:py-10">
          <section className="flex justify-between w-80 min-h-80 sm:mx-auto sm:w-80 md:w-240">
            <div className="features">
              <h3 className="text-2xl sm:text-3xl">测验模式加强字幕记忆</h3>
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
        </div>
      </div>
      <div className="block my-8 mx-4 py-8 px-4 rounded sm:mx-auto sm:w-180 sm:flex sm:items-center sm:justify-between ">
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
      </div>
      <div className="bg-gray-900 min-h-80"></div>
    </div>
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

export default Website;
