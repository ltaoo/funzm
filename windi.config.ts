import { defineConfig } from "windicss/helpers";

export default defineConfig({
  extract: {
    include: ["**/*.{jsx,css,tsx}"],
    exclude: ["node_modules", ".git", ".next/**/*"],
  },
  //   attributify: true,
  shortcuts: {
    btn: "rounded border border-green-500 text-gray-100 bg-green-500 px-6 py-2 inline-block cursor-pointer hover:bg-green-600",
    "btn--primary":
      "border border-green-500 text-gray-100 bg-green-500 hover:bg-green-600",
    "btn--ghost":
      "border border-gray-100 text-gray-100 bg-none hover:border-green-600",
    text1: "text-md text-gray-400 dark:text-gray-400",
    text2: "text-2xl font-serif text-gray-800 dark:text-gray-300",
  },
  plugins: [
    require("windicss/plugin/line-clamp"),
    require("windicss/plugin/forms"),
  ],
});
