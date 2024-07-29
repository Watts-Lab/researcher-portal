/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const WindiCSSWebpackPlugin = require('windicss-webpack-plugin');

module.exports = {
  ...nextConfig,
  webpack: (config) => {
    config.plugins.push(new WindiCSSWebpackPlugin({
      virtualModulePath: 'src/virtual:windi.css',
    }));
    //console.log("Webpack config:", config);
    return config;
  },
  /*
  env: {
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  },
  */
};
