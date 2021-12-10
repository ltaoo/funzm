/**
 * @file 通用布局顶部
 */
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import Avatar from "antd/lib/avatar";
import "antd/lib/avatar/style/index.css";
import Divider from "antd/lib/divider";
import "antd/lib/divider/style/index.css";

import { signIn, signOut, useSession } from "@/next-auth/client";

export default function Header(props) {
  const [session, loading] = useSession();
  const router = useRouter();

  const user = session?.user;

  if (loading) {
    return null;
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width"></meta>
      </Head>
      <header>
        <noscript>
          <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
        </noscript>
        <div className="flex items-center py-4 px-4 shadow-md justify-between">
          <p>Caption</p>
          {!user && (
            <span className="flex items-center text-base px-1 text-sm">
              <div
                className="cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  // signIn();
                  router.push({
                    pathname: "/user/login",
                  });
                }}
              >
                登录
              </div>
              <Divider type="vertical" />
              <Link href="/user/register">
                <div className="cursor-pointer">注册</div>
              </Link>
            </span>
          )}
          {user && (
            <div className="flex items-center cursor-pointer">
              <Link href="/dashboard">
                <Avatar
                  size={40}
                  src={user.image ? `url(${user.image})` : undefined}
                >
                  {user.name?.slice(0, 1)}
                </Avatar>
              </Link>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
