const WindiWebpackPlugin = require("windicss-webpack-plugin");

module.exports = {
  assetPrefix: process.env.prod ? "//static.funzm.com/" : "",
  swcMinify: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Important: return the modified config
    config.plugins.push(new WindiWebpackPlugin());
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
