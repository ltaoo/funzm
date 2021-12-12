/**
 * @file 字幕卡片
 */
import {
  AcademicCapIcon,
  PencilAltIcon,
  TranslateIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
import { useRouter } from "next/router";

const CaptionCard = (props) => {
  const { id, title } = props;

  const router = useRouter();

  return (
    <div className="p-4 rounded border">
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
          <a href={`/captions/review/simple/${id}`}>
            <AcademicCapIcon className="w-6 h-6 text-gray-500 hover:text-gray-800" />
          </a>
        </button>
        <button className="text-sm">
          <PencilAltIcon className="w-6 h-6 text-gray-500 hover:text-gray-800" />
        </button>
        <button className="text-sm">
          <TrashIcon className="w-6 h-6 text-gray-500 hover:text-gray-800" />
        </button>
      </div>
    </div>
  );
};

export default CaptionCard;
