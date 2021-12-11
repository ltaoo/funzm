import { defineConfig } from "windicss/helpers";

export default defineConfig({
  extract: {
    include: ["**/*.{jsx,css,tsx}"],
    exclude: ["node_modules", ".git", ".next/**/*"],
  },
  //   attributify: true,
  shortcuts: {
    btn: "rounded-sm border border-gray-300 text-gray-100 bg-blue-500 px-4 py-1 m-2 inline-block cursor-pointer hover:shadow",
  },
  plugins: [
    require("windicss/plugin/line-clamp"),
    require('windicss/plugin/forms'),
  ],
});
