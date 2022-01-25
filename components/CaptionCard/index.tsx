/**
 * @file 字幕卡片
 */
import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/router";

import { BookOpenIcon, PencilAltIcon, TrashIcon } from "@ltaoo/icons/outline";
import { deleteCaptionService } from "@/domains/caption/services";

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
      pathname: `/exam/prepare/${idRef.current}`,
    });
  }, []);

  const deleteCaption = useCallback(async () => {
    await deleteCaptionService(idRef.current);
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
    <div className="p-4 rounded-xl bg-gray-100 cursor-pointer shadow hover:shadow-xl">
      <p
        className="text-2xl text-gray-800 line-clamp-2 break-all cursor-pointer"
        onClick={() => {
          router.push({
            pathname: `/captions/${id}`,
          });
        }}
      >
        {title}
      </p>
      <div className="inline-flex justify-space-between mt-4 py-2 px-4 space-x-4 bg-gray-800 rounded-xl shadow">
        <button className="text-sm">
          <BookOpenIcon
            className="w-6 h-6 text-gray-100 hover:text-white"
            onClick={fetchCurExamScene}
          />
        </button>
        <button className="text-sm" onClick={gotoEditor}>
          <PencilAltIcon className="w-6 h-6 text-gray-100 hover:text-white" />
        </button>
        <button className="text-sm" onClick={deleteCaption}>
          <TrashIcon className="w-6 h-6 text-gray-100 hover:text-white" />
        </button>
      </div>
    </div>
  );
};

export default CaptionCard;
