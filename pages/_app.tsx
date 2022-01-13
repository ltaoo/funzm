import { useEffect } from "react";
import { AppProps } from "next/app";
import Script from "next/script";
import dayjs from "dayjs";
import zhCN from 'dayjs/locale/zh-cn';

import { getSession, Provider } from "@/next-auth/client";

import "windi.css";

import "../styles/global.css";

dayjs.locale('zh-CN', zhCN);

//   window.addEventListener("unhandledrejection", (err) => {
//     if (err.reason.code !== undefined) {
//       console.log(err.reason.message);
//       return;
//     }
//     throw err;
//   });

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  useEffect(() => {
    // @ts-ignore
    window._user = session?.user;
  }, []);
  return (
    <Provider session={session} options={{}}>
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `if (
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) &&
              window.matchMedia("(prefers-color-scheme: dark)").matches)
          ) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }`,
        }}
      />
      <Component {...pageProps} />
    </Provider>
  );
}

App.getInitialProps = async (context) => {
  const session = await getSession(context);
  return {
    pageProps: {
      session,
    },
  };
};
