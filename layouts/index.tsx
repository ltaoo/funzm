import Head from "next/head";

import { useUser } from "@/domains/user/hooks";
import Spin from "@/components/Spin";

import Header from "./header";
import { tabTitle } from "@/utils";

interface LayoutProps {
  title?: string;
  children: React.ReactNode;
}

export default function Layout({ title, children }: LayoutProps) {
  const user = useUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Spin theme="dark" />
      </div>
    );
  }

  return (
    <div className="pl-52 bg-gray-50">
      {title && (
        <Head>
          <title>{tabTitle(title)}</title>
        </Head>
      )}
      <Header user={user} />
      <main className="flex-1 min-h-screen py-8 px-8">{children}</main>
    </div>
  );
}
