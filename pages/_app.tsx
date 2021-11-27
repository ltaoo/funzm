import { AppProps } from "next/app";

import "../styles/global.css";
import "windi.css";
import 'antd/dist/antd.min.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
