/**
 * @file 字幕预览骨架屏
 */

const CaptionPreviewSkeleton = () => {
  return (
    <div className="relative">
      <div className="py-10 px-4 bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-600">
        <div className="mx-auto md:w-180">
          <h2 className="h-9 text-3xl break-all bg-gray-200 dark:text-gray-400"></h2>
          {/* <h2 className="mt-2 w-12 h-6 text-3xl break-all bg-gray-200 dark:text-gray-400"></h2> */}
          <div className="flex items-center mt-4 space-x-8">
            <div className="flex items-center">
              <span className="w-8 h-6 text-gray-400 bg-gray-200"></span>
            </div>
            <div className="flex items-center">
              <span className="w-8 h-6 text-gray-400 bg-gray-200"></span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 px-4 pb-20 space-y-6 md:mx-auto md:w-180 md:px-0">
        <div className="space-y-1">
          <p className="text1 w-48 h-6 bg-gray-100"></p>
          <p className="text2 h-8 bg-gray-100"></p>
        </div>
        <div className="space-y-1">
          <p className="text1 w-12 h-6 bg-gray-100"></p>
          <p className="text2 w-20 h-8 bg-gray-100"></p>
        </div>
        <div className="space-y-1">
          <p className="text1 h-6 bg-gray-100"></p>
          <p className="text2 h-8 bg-gray-100"></p>
          <p className="text2 w-60 h-8 bg-gray-100"></p>
        </div>
      </div>
    </div>
  );
};

export default CaptionPreviewSkeleton;
