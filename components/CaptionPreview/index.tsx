/**
 * @file 字幕预览
 */
import React, { Fragment, useState, useCallback, useMemo } from "react";
import { Disclosure, Menu, Dialog, Transition } from "@headlessui/react";
import { CalendarIcon, UserIcon, XIcon } from "@heroicons/react/outline";
import { StarIcon } from "@heroicons/react/solid";

import { splitText2Words } from "@/domains/caption/utils";
import SoundPlay from "@/components/SoundPlay";

const CaptionPreview = (props) => {
  const { title, createdAt, paragraphs = [] } = props;

  const [open, setOpen] = useState(false);
  const [curWordTranslation, setCurWordTranslation] =
    useState<{ word: string }>();

  const viewWord = useCallback(async (word) => {
    setOpen(true);
    setCurWordTranslation({ word });
  }, []);

  return (
    <div className="relative">
      <div className="py-10 px-4 bg-gray-100 border-b">
        <div className="mx-auto sm:w-180">
          <h2 className="text-3xl break-all">{title}</h2>
          <div className="flex items-center mt-4 space-x-8">
            <div className="flex items-center">
              <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-gray-400">Unknown</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-gray-400">{createdAt}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 px-4 pb-20 space-y-6 sm:mx-auto sm:w-180">
        {paragraphs.map((caption) => {
          const { line, text1, text2 } = caption;
          return (
            <div key={line}>
              <p className="text-md text-gray-400 dark:text-white">{text1}</p>
              <p className="">
                {(() => {
                  const words = splitText2Words(text2);
                  return words.map((word, i) => {
                    return (
                      <span
                        className="text-2xl font-serif text-black dark:text-white"
                        key={i}
                      >
                        {word[0]}
                        <span
                          className="cursor-pointer"
                          onClick={(event) => {
                            event.preventDefault();
                            viewWord(word[1]);
                          }}
                        >
                          {word[1]}
                        </span>
                        {word[2]}
                        {i === words.length - 1 ? "" : " "}
                      </span>
                    );
                  });
                })()}
              </p>
            </div>
          );
        })}
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={setOpen}
        >
          <div
            className="flex min-h-screen text-center md:block md:px-2 lg:px-4"
            style={{ fontSize: 0 }}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>
            <span
              className="hidden md:inline-block md:align-middle md:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              enterTo="opacity-100 translate-y-0 md:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 md:scale-100"
              leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            >
              <div className="flex text-base text-left transform transition w-full md:inline-block md:max-w-2xl md:px-4 md:my-8 md:align-middle lg:max-w-4xl">
                <div className="w-full relative flex items-center px-4 bg-white dark:bg-black pt-14 pb-8 overflow-hidden shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                  <button
                    type="button"
                    className="absolute top-4 focus:outline-none w-6 h-6 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                  {(() => {
                    if (!curWordTranslation) {
                      return null;
                    }
                    const { word } = curWordTranslation;
                    return (
                      <div className="w-full mt-8">
                        <p className="text-base text-center text-3xl text-black dark:text-white">
                          {word}
                        </p>
                        <p className="cursor-pointer">
                          <SoundPlay
                            // type=0 表示美音 type=1 表示英音
                            src={`http://dict.youdao.com/dictvoice?type=0&audio=${word}`}
                          />
                        </p>
                        <div className="h-80"></div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default React.memo(CaptionPreview);
