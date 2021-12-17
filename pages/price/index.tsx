import SiteLayout from "@/layouts/site";
import { useSession } from "@/next-auth/client";

/**
 * @file 订阅页面
 */
const PricePage = () => {
  const session = useSession();
  return (
    <SiteLayout user={session?.user}>
      <div>
        <div className="border rounded">
          <div className="text-2xl">Free</div>
        </div>
      </div>
    </SiteLayout>
  );
};

export default PricePage;
