import Layout from "@/layouts";

import { CheckCircleIcon } from "@ltaoo/icons/outline";

/**
 * @file 操作成功提示页面
 */
const SuccessTipPage = () => {
  return (
    <Layout title="操作成功">
      <div className="flex flex-col items-center">
        <div className="mt-24">
          <CheckCircleIcon className="inline-block w-16 h-16 text-green-500" />
          <div>
            <p className="mt-4 text-3xl text-green-500 text-center">成功</p>
          </div>
        </div>
        <div className="mt-12">
          <div className="inline-block py-2 px-4 text-gray-100 bg-gray-800 rounded shadow">
            返回首页
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SuccessTipPage;
