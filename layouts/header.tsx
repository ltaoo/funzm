/**
 * @file 通用布局顶部
 */
import { useMemo } from "react";
import Link from "next/link";
import Head from "next/head";
import { Avatar, Divider } from "antd";

import { signIn, signOut, useSession } from "@/next-auth/client";
// import styles from "./header.module.css";

// The approach used in this component shows how to built a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header(props) {
  const [session, loading] = useSession();

  const user = session?.user;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width"></meta>
      </Head>
      <header>
        <noscript>
          <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
        </noscript>
        <div className="py-2 px-1 shadow-lg">
          {!user && (
            <span className="text-base px-1 text-sm">
              {/* <Link href="/api/auth/signin">登录</Link> */}
              <a
                onClick={(e) => {
                  e.preventDefault();
                  signIn();
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
