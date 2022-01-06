/**
 * @file 字幕卡片
 */
import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  AcademicCapIcon,
  PencilAltIcon,
  TranslateIcon,
  TrashIcon,
} from "@ltaoo/icons/outline";
import { deleteCaptionService } from "@/services/caption";
import { fetchCurExamSceneByCaption } from "@/services/exam";

const CaptionCard = (props) => {
  const { id, title, onDelete } = props;

  const idRef = useRef(id);
  useEffect(() => {
    idRef.current = id;
  }, [id]);

  const router = useRouter();

  const fetchCurExamScene = useCallback(async () => {
    // @ts-ignore
    // const { id } = await fetchCurExamSceneByCaption({
    //   captionId: idRef.current,
    // });
    router.push({
      pathname: `/exam/simple/prepare/${idRef.current}`,
    });
  }, []);

  const deleteCaption = useCallback(async () => {
    await deleteCaptionService(idRef.current);
    alert("删除成功");
    if (onDelete) {
      onDelete();
    }
  }, [onDelete]);

  const gotoEditor = useCallback(() => {
    router.push({
      pathname: `/captions/editor/${idRef.current}`,
    });
  }, []);

  return (
    <div className="p-4 rounded border bg-white shadow-md shadow-green-500">
      <p
        className="text-xl text-gray-800 line-clamp-2 break-all cursor-pointer"
        onClick={() => {
          router.push({
            pathname: `/captions/${id}`,
          });
        }}
      >
        {title}
      </p>
      <div className="flex justify-space-between mt-4 space-x-4">
        <button className="text-sm">
          <AcademicCapIcon
            className="w-6 h-6 text-gray-500 hover:text-gray-800"
            onClick={fetchCurExamScene}
          />
        </button>
        <button className="text-sm" onClick={gotoEditor}>
          <PencilAltIcon className="w-6 h-6 text-gray-500 hover:text-gray-800" />
        </button>
        <button className="text-sm" onClick={deleteCaption}>
          <TrashIcon className="w-6 h-6 text-gray-500 hover:text-gray-800" />
        </button>
      </div>
    </div>
  );
};

export default CaptionCard;
