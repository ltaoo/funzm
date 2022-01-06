import { useEffect } from "react";
import { User } from ".prisma/client";

import { getSession } from "@/next-auth/client";

import Header from "./header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Header />
      <main className="min-h-screen py-4 px-2 bg-gray-100">{children}</main>
    </div>
  );
}
