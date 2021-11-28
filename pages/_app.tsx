import { AppProps } from "next/app";
import Head from "next/head";

import "antd/dist/antd.min.css";
import "windi.css";

import "../styles/global.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <meta name="viewport" content="width=device-width"></meta>
      </Head>
      <Component {...pageProps} />
    </div>
  );
}
