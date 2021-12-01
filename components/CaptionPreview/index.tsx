/**
 * @file 字幕预览
 */
import React, { Fragment, useState, useCallback, useMemo } from "react";
import { Disclosure, Menu, Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { StarIcon } from "@heroicons/react/solid";

import { splitText2 } from '@/domains/caption/utils';

import Popover from "antd/lib/popover";
import "antd/lib/popover/style/index.css";

/**
 * 清洗单词，移除两边符号等无用字符
 */
function cleanWord(word) {
  return word;
}
const CaptionPreview = (props) => {
  const { title, paragraphs = [] } = props;

  const [open, setOpen] = useState(false);
  const [curWord, setCurWord] = useState();

  const viewWord = useCallback((word) => {
    setOpen(true);
    setCurWord(word);
  }, []);

  return (
    <div className="2xl:mx-auto 2xl:w-180 overflow-hidden pb-20 space-y-2">
      <h2 className="mt-6 px-4 text-2xl break-all text-black dark:text-white break-all">
        {title}
      </h2>
      <div className="mt-10 px-4 space-y-6">
        {paragraphs.map((caption) => {
          const { line, text1, text2 } = caption;
          return (
            <div key={line}>
              <p className="text-xs text-black dark:text-white">{text1}</p>
              <p className="break-all">
                {(() => {
                  const words = splitText2(text2);
                  return words.map((word, i) => {
                    return (
                      <span
                        className="text-lg font-serif text-black dark:text-white"
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
                  <div className="w-full mt-8">
                    <p className="text-base text-center text-3xl text-black dark:text-white">{curWord}</p>
                    <div className="h-80"></div>
                  </div>
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
