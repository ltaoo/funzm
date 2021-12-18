import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import Link from "next/link";
import {
  AdjustmentsIcon,
  BookOpenIcon,
  ChartSquareBarIcon,
  DeviceMobileIcon,
  DocumentTextIcon,
  DownloadIcon,
  EmojiHappyIcon,
  MenuIcon,
  MoonIcon,
  TranslateIcon,
  UploadIcon,
  UserIcon,
  VolumeUpIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";

const navigation = [
  { name: "功能", href: "/" },
  { name: "订阅", href: "/price" },
  { name: "帮助中心", href: "/help" },
  { name: "关于我们", href: "/about" },
];

const SiteHeader = (props) => {
  const { user } = props;

  const router = useRouter();

  return (
    <Popover className="header">
      <div className="relative py-6 px-4 sm:px-6 lg:px-8">
        <nav
          className="relative flex items-center justify-between sm:h-10"
          aria-label="Global"
        >
          <div className="logo flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
            <div className="flex items-center justify-between w-full md:w-auto">
              <a href="#">
                <span className="sr-only">FunZM</span>
                <img
                  className="h-8 w-auto sm:h-10"
                  src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                />
              </a>
              <div className="flex items-center md:hidden">
                <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center outline-0 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:bg-gray-800 hover:dark:bg-gray-700">
                  <span className="sr-only">Open main menu</span>
                  <MenuIcon className="h-6 w-6" aria-hidden="true" />
                </Popover.Button>
              </div>
            </div>
          </div>
          <div className="flex items-center hidden md:block md:ml-10 md:pr-4 md:space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                className="inline font-medium text-gray-500 cursor-pointer hover:text-gray-900"
                href={item.href}
              >
                {item.name}
              </a>
            ))}
            {user ? (
              <div
                className="inline-flex rounded bg-gray-100 p-2 px-4 items-center font-medium text-green-600 cursor-pointer hover:text-green-500 dark:bg-gray-800"
                onClick={() => {
                  router.push({
                    pathname: "/dashboard",
                  });
                }}
              >
                个人中心
              </div>
            ) : (
              <div
                className="inline font-medium text-green-600 cursor-pointer hover:text-green-500"
                onClick={() => {
                  router.push({
                    pathname: "/user/login",
                  });
                }}
              >
                登录
              </div>
            )}
          </div>
        </nav>
      </div>
      <Transition
        as={Fragment}
        enter="duration-150 ease-out"
        enterFrom="opacity-0"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0"
      >
        <Popover.Panel
          focus
          className="absolute z-10 top-0 inset-x-0 transition transform origin-top-right md:hidden"
        >
          <div className="rounded-lg shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden dark:bg-gray-800">
            <div>
              <div className="flex items-center justify-between px-4 py-6">
                <div>
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                    alt=""
                  />
                </div>
                <div className="">
                  <Popover.Button className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 outline-0 hover:text-gray-500 hover:bg-gray-100 focus:outline-none dark:bg-gray-700">
                    <span className="sr-only">Close main menu</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
            <div
              className="block w-full px-5 py-3 text-center font-medium text-green-600 bg-gray-50 cursor-pointer hover:bg-gray-100 dark:bg-gray-700"
              onClick={() => {
                router.push({
                  pathname: user ? "/dashboard" : "/user/login",
                });
              }}
            >
              {user ? "个人中心" : "登录"}
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default SiteHeader;
