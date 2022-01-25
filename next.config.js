const cp = require("child_process");
const path = require("path");

const WindiWebpackPlugin = require("windicss-webpack-plugin");

const commit = cp.execSync('git log -1 --pretty=format:"%H"');

module.exports = {
  assetPrefix: process.env.prod ? `//static.funzm.com/${commit}/` : "",
  swcMinify: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Important: return the modified config
    config.plugins.push(new WindiWebpackPlugin());
    config.resolve.alias = {
      ...config.resolve.alias,
      "@list/core": path.resolve(__dirname, "./utils/list/core/src/index"),
      "@list/hooks": path.resolve(__dirname, "./utils/list/hook/src/index"),
    };
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
