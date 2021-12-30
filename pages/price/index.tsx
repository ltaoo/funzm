import SiteLayout from "@/layouts/site";
import { useSession } from "@/next-auth/client";

/**
 * @file 订阅页面
 */
const PricePage = () => {
  const session = useSession();
  return (
    <SiteLayout user={session?.user}>
      <div className="flex justify-center">
        <div className="flex space-x-12 mt-24">
          <div className="w-64 p-8 bg-white rounded shadow-xl">
            <div className="text-2xl text-gray-800">试用7天</div>
            <div className="mt-8 text-4xl text-gray-800">Free</div>
            <div className="mt-12 text-gray-800">
              <p>一个字幕槽</p>
              <p>正式会员全功能</p>
            </div>
          </div>
          <div className="w-64 p-8 bg-white rounded shadow-xl">
            <div className="text-2xl text-gray-800">会员</div>
            <div className="mt-8 text-4xl text-gray-800">
              8￥<span className="text-xl line-through">12￥</span>/月
            </div>
            <div className="mt-12 text-gray-800">
              <p>三个字幕槽</p>
              <p>使用积分购买字幕槽</p>
              <p>签到获得积分</p>
            </div>
          </div>
          <div className="w-64 p-8 bg-white rounded shadow-xl">
            <div className="text-2xl text-gray-800">会员</div>
            <div className="mt-8 text-4xl text-gray-800">
              88￥<span className="text-xl line-through">120￥</span>/年
            </div>
            <div className="mt-12 text-gray-800">
              <p>三个字幕槽</p>
              <p>全功能</p>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
};

export default PricePage;
