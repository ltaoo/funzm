import { CheckIcon } from "@ltaoo/icons/outline";

/**
 * @file 操作成功提示页面
 */
const SuccessTipPage = () => {
  return (
    <div className="overflow-hidden min-h-screen h-full bg-gray-100">
      <div className="flex justify-center mt-24">
        <CheckIcon className="inline-block w-16 h-16 text-green-500" />
        <p className="inline-block mt-4 text-green-500">成功</p>
      </div>
    </div>
  );
};

export default SuccessTipPage;
