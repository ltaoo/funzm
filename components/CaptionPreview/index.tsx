/**
 * @file 字幕查看
 */
import React from "react";
import { CalendarIcon, UserIcon } from "@ltaoo/icons/outline";

import { ICaptionValues } from "@/domains/caption/types";

interface IProps extends ICaptionValues {}
const CaptionPreview: React.FC<IProps> = (props) => {
  const { title, paragraphs = [], author = "unknown", createdAt } = props;

  return (
    <div className="relative">
      <div className="py-10 px-4 bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-600">
        <div className="mx-auto md:w-180">
          <h2 className="text-3xl break-all dark:text-gray-400">{title}</h2>
          <div className="flex items-center mt-4 space-x-8">
            <div className="flex items-center">
              <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-gray-400">{author}</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-gray-400">{createdAt}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 px-4 pb-20 space-y-6 md:mx-auto md:w-180 md:px-0">
        {paragraphs.map((caption) => {
          const { line, text1, text2 } = caption;
          return (
            <div key={line}>
              <p className="text1">{text1}</p>
              <p className="text2">{text2}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CaptionPreview;
