"use strict";
const utils = require("./utils");
const baseConfig = require("./base.conf");
const isProduction = process.env.NODE_ENV === "production";
const sourceMapEnabled = isProduction
  ? baseConfig.build.productionSourceMap
  : baseConfig.dev.cssSourceMap;

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isProduction,
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: baseConfig.dev.cacheBusting,
  transformToRequire: {
    video: ["src", "poster"],
    source: "src",
    img: "src",
    image: "xlink:href",
  },
};
