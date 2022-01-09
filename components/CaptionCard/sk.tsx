/**
 * @file 字幕卡片骨架屏
 */

const FakeCaptionCard = () => {
  return (
    <div className="p-4 rounded border bg-white shadow-md shadow-green-500">
      <p className="text-xl text-gray-800 line-clamp-2 break-all cursor-pointer bg-gray-100">
        &nbsp;
      </p>
      <div className="flex justify-space-between mt-4 space-x-4">
        <button className="text-sm">
          <div className="w-6 h-6 text-gray-500 bg-gray-100 hover:text-gray-800" />
        </button>
        <button className="text-sm">
          <div className="w-6 h-6 text-gray-500 bg-gray-100 hover:text-gray-800" />
        </button>
        <button className="text-sm">
          <div className="w-6 h-6 text-gray-500 bg-gray-100 hover:text-gray-800" />
        </button>
      </div>
    </div>
  );
};

export default FakeCaptionCard;
