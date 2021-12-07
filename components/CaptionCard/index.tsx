/**
 * @file 字幕卡片
 */
import { useRouter } from "next/router";

const CaptionCard = (props) => {
  const { id, title } = props;

  const router = useRouter();

  return (
    <div className="p-2 rounded border">
      <p
        className="h-12 text-gray-800 line-clamp-2 break-all cursor-pointer"
        onClick={() => {
          router.push({
            pathname: `/captions/${id}`,
          });
        }}
      >
        {title}
      </p>
      <div className="flex justify-space-between mt-4 space-x-2">
        <button
          className="text-sm"
          onClick={() => {
            router.push({
              pathname: `/captions/review/simple/${id}`,
            });
          }}
        >
          测试
        </button>
        <button className="text-sm">编辑</button>
      </div>
    </div>
  );
};

export default CaptionCard;
