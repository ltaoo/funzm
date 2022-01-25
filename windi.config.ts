import { defineConfig } from "windicss/helpers";
import plugin from "windicss/plugin";

export default defineConfig({
  extract: {
    include: ["**/*.{jsx,css,tsx}"],
    exclude: ["node_modules", ".git", ".next/**/*"],
  },
  //   attributify: true,
  shortcuts: {
    "primary-color": "bg-gray-800",
    btn: "rounded border border-green-500 text-gray-100 bg-green-500 px-6 py-2 inline-block cursor-pointer hover:bg-green-600",
    "btn--primary":
      "border border-green-500 text-gray-100 bg-green-500 hover:bg-green-600",
    "btn--ghost":
      "border border-gray-100 text-gray-100 bg-none hover:border-green-600",
    text1: "text-xl text-gray-400 dark:text-gray-400",
    text2: "text-3xl font-serif text-gray-800 dark:text-gray-300",
    icon: "w-10 h-10 p-2 text-gray-500 rounded cursor-pointer hover:bg-gray-100 dark:text-gray-200 dark:hover:text-gray-800",
    "icon--small":
      "w-6 h-6 p-2 text-gray-500 rounded cursor-pointer hover:bg-gray-100",
    "icon--large":
      "w-12 h-12 p-2 text-gray-500 rounded cursor-pointer hover:bg-gray-100",
  },
  plugins: [
    require("windicss/plugin/line-clamp"),
    require("windicss/plugin/forms"),
    plugin(({ addUtilities }) => {
      const newUtilities = {
        ".decoration-wavy": {
          "-webkit-text-decoration-style": "wavy",
          "text-decoration-style": "wavy",
        },
      };
      addUtilities(newUtilities);
    }),
  ],
});
