"use strict";
const path = require("node:path");
const utils = require("./utils");
const baseConfig = require("./base.conf");
const vueLoaderConfig = require("./vue-loader.conf");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const WebpackBar = require("webpackbar");
const TerserPlugin = require("terser-webpack-plugin");

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: "eslint-loader",
  enforce: "pre",
  include: [resolve("src"), resolve("test")],
  options: {
    formatter: require("eslint-friendly-formatter"),
    emitWarning: !baseConfig.dev.showEslintErrorsInOverlay,
  },
});

module.exports = {
  context: path.resolve(__dirname, "../"),
  entry: {
    app: "./src/main.js",
  },
  output: {
    path: baseConfig.build.assetsRoot,
    filename: "[name].js",
    publicPath:
      process.env.NODE_ENV === "production"
        ? baseConfig.build.assetsPublicPath
        : baseConfig.dev.assetsPublicPath,
  },
  resolve: {
    extensions: [".js", ".vue", ".json"],
    alias: {
      vue$: "vue/dist/vue.esm.js",
      "@": resolve("src"),
    },
  },
  module: {
    rules: [
      // ...(baseConfig.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: vueLoaderConfig,
        include: [resolve("src")],
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: "thread-loader",
            options: {
              workers: require("os").cpus() - 1,
            },
          },
          // {
          //   loader: "babel-loader",
          //   options: {
          //     cacheDirectory: true,
          //   },
          // },
          {
            loader: "esbuild-loader",
            options: {
              target: "es2015",
            },
          },
        ],
        include: [path.posix.resolve("src")],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: utils.assetsPath("img/[name].[hash:7].[ext]"),
        },
        include: [resolve("src")],
        exclude: /node_modules/,
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: utils.assetsPath("media/[name].[hash:7].[ext]"),
        },
        include: [resolve("src")],
        exclude: /node_modules/,
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: utils.assetsPath("fonts/[name].[hash:7].[ext]"),
        },
        include: [resolve("src")],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new WebpackBar({
      profile: true,
      basic: true,
    }),
  ],
  stats: {
    children: true,
    errorDetails: true,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
    runtimeChunk: "single",
    moduleIds: "deterministic",
    splitChunks: {
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
            );
            if (packageName) {
              return `npm.${packageName[1].replace("@", "")}`;
            }
          },
        },
        styles: {
          name: "styles",
          test: /\.css$/,
          chunks: "all",
          enforce: true,
        },
      },
    },
  },
};
