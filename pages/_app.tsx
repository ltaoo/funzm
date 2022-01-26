import { AppProps } from "next/app";
import Script from "next/script";
import dayjs from "dayjs";
import zhCN from "dayjs/locale/zh-cn";

import { Provider } from "@/next-auth/client";
import Helper from "@list/core";

import "../styles/global.css";

import "react-toastify/dist/ReactToastify.css";
import "windi.css";

dayjs.locale("zh-CN", zhCN);

Helper.onError = (err) => {
  console.log(err);
};

if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (err) => {
    // console.log("[ERROR]unhandledrejection", err);
    if (err.reason.code !== undefined) {
      err.stopPropagation();
      alert(err.reason.message);
      if (err.reason.code === 401) {
        window.location.replace("/");
        return;
      }
      return;
    }
    throw err;
  });
}

export default function App({
  Component,
  pageProps: { user, ...pageProps },
}: AppProps) {
  return (
    <Provider user={user} options={{}}>
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

// App.getInitialProps = async (context) => {
//   const user = await fetchUserProfileService();
//   return {
//     pageProps: {
//       user,
//     },
//   };
// };
