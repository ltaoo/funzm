export enum Theme {
  light = "light",
  dark = "dark",
}

/**
 * 切换到浅色主题
 */
export function lightTheme() {
  localStorage.theme = "light";
  document.documentElement.classList.remove("dark");
}

/**
 * 切换到黑暗主题
 */
export function darkTheme() {
  localStorage.theme = "dark";
  document.documentElement.classList.add("dark");
}

/**
 * 切换主题
 * @returns
 */
export function toggleTheme() {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    return Theme.light;
  }
  document.documentElement.classList.add("dark");
  return Theme.dark;
}
export function autoTheme() {
  // respect the OS preference
  localStorage.removeItem("theme");
}

/**
 * 获取当前主题
 * @returns
 */
export function getCurTheme() {
  if (
    localStorage.theme === Theme.dark ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    return Theme.dark;
  }
  return Theme.light;
}

export function initTheme() {
  if (getCurTheme() === Theme.dark) {
    document.documentElement.classList.add(Theme.dark);
  } else {
    document.documentElement.classList.remove(Theme.dark);
  }
}
