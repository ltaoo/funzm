/**
 * @file 侧边导航栏
 */
import { Fragment, useEffect, useState } from "react";
import cx from "classnames";
import { useRouter } from "next/router";

import { Transition } from "@headlessui/react";
import {
  BellIcon,
  ClipboardListIcon,
  CurrencyYenIcon,
  DocumentTextIcon,
  FilmIcon,
  FingerPrintIcon,
  GiftIcon,
  HomeIcon,
  LogoIcon,
  LogoutIcon,
} from "@ltaoo/icons/outline";

import { logout } from "@/services/auth";
import Tooltip from "@/components/Tooltip";
import Avatar from "@/components/Avatar";
import { useVisible } from "@/hooks";

export default function Header(props) {
  const { user } = props;

  const router = useRouter();
  const { pathname } = router;
  const [visible, show, hide] = useVisible();

  useEffect(() => {
    const handler = () => {
      hide();
    };
    document.addEventListener("click", handler);

    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  const [navigation, setNavigation] = useState([
    {
      name: "首页",
      icon: <HomeIcon className="inline-block w-8 h-8 text-gray-200" />,
      href: "/dashboard",
      current: true,
    },
    {
      name: "字幕",
      icon: <FilmIcon className="inline-block w-8 h-8 text-gray-200" />,
      href: "/captions",
      current: false,
    },
    {
      name: "笔记",
      icon: (
        <ClipboardListIcon className="inline-block w-8 h-8 text-gray-200" />
      ),
      href: "/notes",
      current: false,
    },
    // {
    //   name: <BookmarkAltIcon className="inline-block w-8 h-8 text-gray-200" />,
    //   href: "/words",
    //   current: false,
    // },
    {
      name: "错题",
      icon: <DocumentTextIcon className="inline-block w-8 h-8 text-gray-200" />,
      href: "/spellings",
      current: false,
    },
    // { name: "问题反馈", href: "/feedback", current: false },
  ]);
  const [selectedNav, setSelectedNav] = useState("/dashboard");

  useEffect(() => {
    const [, scope] = pathname.split("/");
    const matchedScope = navigation.find((nav) => nav.href === `/${scope}`);
    if (matchedScope) {
      setSelectedNav(matchedScope.href);
    }
  }, [pathname]);

  if (!user) {
    return null;
  }

  return (
    <nav className="#nav flex flex-col justify-between fixed left-10 top-[50%] w-36 h-[90%] px-4 py-6 rounded-3xl shadow-xl bg-gray-800 transform -translate-y-2/4">
      <div>
        <div
          className="#logo text-center cursor-pointer"
          onClick={() => {
            router.push({
              pathname: "/dashboard",
            });
          }}
        >
          <LogoIcon className="inline-block h-12 w-12 text-green-500" />
        </div>
        <div className="#menus mt-8">
          {navigation.map((item) => (
            <Tooltip key={item.href} content={item.name}>
              <a
                href={item.href}
                className={cx(
                  item.href === selectedNav
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "#menu inline-block w-full mb-6 px-2 py-2 text-center rounded-md text-sm font-medium"
                )}
                // aria-current={item.href === selectedNav ? "page" : undefined}
              >
                {item.icon}
              </a>
            </Tooltip>
          ))}
        </div>
      </div>
      <div className="#user flex justify-center mt-8">
        <div className="relative">
          <div
            className="w-12 h-12 bg-gray-800 rounded-full cursor-pointer"
            onClick={(event) => {
              event.stopPropagation();
              show();
            }}
          >
            <Avatar url={user?.avatar} />
          </div>
          <Transition
            as={Fragment}
            show={visible}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <div
              className="absolute -right-52 bottom-0 w-48 rounded shadow-xl bg-white"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <div className="#arrow z-index-1 absolute -left-1 bottom-4 w-3 h-3 rounded bg-white transform rotate-45" />
              <div className="relative z-index-2 p-2 px-4">
                <div className="text-xl text-gray-500">{user?.nickname}</div>
                <Tooltip content="查看积分明细">
                  <div
                    className="text-sm text-gray-500 cursor-pointer"
                    onClick={() => {
                      router.push({
                        pathname: "/scores",
                      });
                    }}
                  >
                    当前积分 {user?.score}
                  </div>
                </Tooltip>
                <div className="absolute right-2 -top-4 inline-block w-18 h-18 rounded-full border-6 border-solid border-white">
                  <Avatar url={user?.avatar} />
                </div>
                <div className="flex mt-4 py-2 space-x-4">
                  <Tooltip content="敬请期待">
                    <BellIcon className="w-6 h-6 cursor-pointer" />
                  </Tooltip>
                  <Tooltip content="敬请期待">
                    <GiftIcon className="w-6 h-6 cursor-pointer" />
                  </Tooltip>
                  <Tooltip content="敬请期待">
                    <FingerPrintIcon className="w-6 h-6 cursor-pointer" />
                  </Tooltip>
                  <Tooltip content="退出登录">
                    <LogoutIcon
                      className="w-6 h-6 cursor-pointer"
                      onClick={() => {
                        logout();
                        router.push({
                          pathname: "/",
                        });
                      }}
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </nav>
  );
}
