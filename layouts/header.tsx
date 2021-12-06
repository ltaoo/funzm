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
    return <div>Loading</div>;
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
        <div className="py-2 px-1 shadow-md">
          {!user && (
            <span className="text-base px-1 text-sm">
              <a
                onClick={(e) => {
                  e.preventDefault();
                  // signIn();
                  router.push({
                    pathname: "/user/login",
                  });
                }}
              >
                登录
              </a>
              <Divider type="vertical" />
              <Link href="/user/register">注册</Link>
            </span>
          )}
          {user && (
            <div className="flex items-center">
              <Link href="/dashboard">
                <Avatar
                  size={20}
                  src={user.image ? `url(${user.image})` : undefined}
                />
              </Link>
              <a
                href={`/api/auth/signout`}
                className="ml-2 text-sm"
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }}
              >
                注销
              </a>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
