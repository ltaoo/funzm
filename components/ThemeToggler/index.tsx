/**
 * @file 主题切换器
 */
import { useCallback, useEffect, useState } from "react";
import cx from "classnames";

import {
  darkTheme,
  getCurTheme,
  lightTheme,
  Theme,
  toggleTheme,
} from "@/utils/dark";

interface IThemeTogglerProps {}
const ThemeToggler = (props) => {
  const [curTheme, setCurTheme] = useState<Theme>(Theme.light);

  useEffect(() => {}, []);
  const toggle = useCallback(() => {
    setCurTheme(toggleTheme());
  }, []);

  console.log("cur theme", curTheme);

  return (
    <div className="#toggle relative cursor-pointer" onClick={toggle}>
      <div
        className="relative w-[90px] h-[48px] rounded-[24px] bg-gray-800"
        role="button"
        tabIndex={-1}
      >
        <div
          className={cx(
            "my-auto absolute top-0 bottom-0 h-[40px] w-[40px] left-[8px] text-3xl",
            curTheme === Theme.dark ? "left-[5px] opacity-1000" : " opacity-0"
          )}
        >
          <span className="flex items-center justify-center w-[40px] h-[40px]">
            🌜
          </span>
        </div>
        <div
          className={cx(
            "my-auto absolute top-0 right-[5px] bottom-0 h-[40px] text-3xl",
            curTheme === Theme.light ? "w-[40px] opacity-1000" : "opacity-0"
          )}
        >
          <span className="flex items-center justify-center w-[40px] h-[40px]">
            🌞
          </span>
        </div>
        <div
          className={cx(
            "absolute top-[5px] left-[5px] w-[38px] h-[38px] rounded-[50%] border-1 duration-300 bg-gray-100 hover:shadow-4xl hover:shadow-green-500",
            curTheme === Theme.dark ? "!left-[46px]" : ""
          )}
        ></div>
      </div>
    </div>
  );
};

export default ThemeToggler;
