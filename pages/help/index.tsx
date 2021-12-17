/**
 * @file 帮助中心
 */
import { useSession } from "@/next-auth/client";
import SiteLayout from "@/layouts/site";

const HelpPage = () => {
  const session = useSession();
  return (
    <SiteLayout user={session?.user}>
      <div className="w-full px-4 md:px-20">
        <h2 className="text-3xl">常见问题</h2>
      </div>
    </SiteLayout>
  );
};

export default HelpPage;
