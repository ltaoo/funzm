import { useEffect } from "react";
import { AppProps } from "next/app";

import { getSession, Provider } from "next-auth/client";

import "windi.css";

import "../styles/global.css";

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
