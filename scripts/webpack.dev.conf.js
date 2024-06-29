"use strict";
const utils = require("./utils");
const webpack = require("webpack");
const baseConfig = require("./base.conf");
const { merge } = require("webpack-merge");
const path = require("path");
const baseWebpackConfig = require("./webpack.base.conf");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const portfinder = require("portfinder");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-v5-plugin");

const smp = new SpeedMeasurePlugin();

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

const devWebpackConfig = smp.wrap(
  merge(baseWebpackConfig, {
    mode: "development",
    cache: {
      type: "filesystem",
      allowCollectingMemory: true,
      compression: "gzip",
      buildDependencies: {
        // 更改配置文件时，重新缓存
        config: [__filename],
      },
    },
    output: {
      filename: "js/[name].js",
      path: path.resolve(__dirname, "../dist"),
      publicPath: "/",
    },
    module: {
      rules: utils.styleLoaders({
        sourceMap: baseConfig.dev.cssSourceMap,
        usePostCSS: true,
      }),
    },
    // cheap-module-eval-source-map is faster for development
    devtool: baseConfig.dev.devtool,

    // these devServer options should be customized in /config/index.js
    devServer: {
      historyApiFallback: {
        rewrites: [
          {
            from: /.*/,
            to: path.posix.join(baseConfig.dev.assetsPublicPath, "index.html"),
          },
        ],
      },
      hot: true,
      compress: true,
      host: HOST || baseConfig.dev.host,
      port: PORT || baseConfig.dev.port,
      open: baseConfig.dev.autoOpenBrowser,
      client: {
        logging: "warn",
        overlay: baseConfig.dev.errorOverlay
          ? { warnings: false, errors: true }
          : false,
      },
      static: {
        publicPath: baseConfig.dev.assetsPublicPath,
        directory: path.join(baseConfig.dev.assetsPublicPath),
      },
      proxy: baseConfig.dev.proxyTable,
      watchFiles: {
        paths: ["src/**/*", "scripts/**/*"],
        options: {
          usePolling: baseConfig.dev.poll,
        },
      },
    },
    plugins: [
      // https://github.com/ampedandwired/html-webpack-plugin
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "index.html",
        inject: true,
      }),
      // copy custom static assets
      new CopyWebpackPlugin({
        patterns: [
          // {
          //   from: path.resolve(
          //     __dirname,
          //     "node_modules/cesium/Build/Cesium/Workers"
          //   ),
          //   to: baseConfig.dev.assetsSubDirectory,
          // },
          { from: "node_modules/cesium/Build/Cesium/Workers", to: "Workers" },
          {
            from: "node_modules/cesium/Build/Cesium/ThirdParty",
            to: "ThirdParty",
          },
          { from: "node_modules/cesium/Build/Cesium/Assets", to: "Assets" },
          { from: "node_modules/cesium/Build/Cesium/Widgets", to: "Widgets" },
        ],
      }),
      new NodePolyfillPlugin(),
      new webpack.DefinePlugin({
        // Define relative base path in cesium for loading assets
        CESIUM_BASE_URL: JSON.stringify(""),
      }),
    ],
  }),
);

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || baseConfig.dev.port;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err);
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port;
      // add port to devServer config
      devWebpackConfig.devServer.port = port;

      // Add FriendlyErrorsPlugin
      // devWebpackConfig.plugins.push();

      resolve(devWebpackConfig);
    }
  });
});
