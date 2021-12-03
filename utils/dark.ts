export function lightTheme() {
  localStorage.theme = "light";
  //       themeRef.current = "light";
  document.documentElement.classList.remove("dark");
  //       setTheme("light");
}
export function darkTheme() {
  localStorage.theme = "dark";
  //       themeRef.current = "dark";
  document.documentElement.classList.add("dark");
  //       setTheme("dark");
}
export function toggleTheme() {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    return;
  }
  document.documentElement.classList.add("dark");
}
export function autoTheme() {
  // respect the OS preference
  localStorage.removeItem("theme");
}

export function initTheme() {
  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}
