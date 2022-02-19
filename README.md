![Vue Cesium](https://user-images.githubusercontent.com/51536312/90954910-6992f280-e4ab-11ea-9ebb-34a8063ca9e8.png)

<p align="center">Vue Cesium By Martin</p>
<p align="center"><a href="https://www.1024.cool">1024.Cool</a></p>

## Project setup

```
git clone git@github.com:martinageradams/vue-cesium-example.git
```

```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Run your unit tests
```
yarn test:unit
```

### Lints and fixes files
```
yarn lint
```

![Vue Cesium](https://user-images.githubusercontent.com/51536312/90951921-de593300-e491-11ea-94b5-17dc26f8ab1e.gif)

### vue.config.js

```js
// vue.config.js
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  configureWebpack: {
    plugins: [
      // Copy Cesium Assets, Widgets, and Workers to a static directory
      new CopyWebpackPlugin({
        patterns: [
          { from: "node_modules/cesium/Build/Cesium/Workers", to: "Workers" },
          {
            from: "node_modules/cesium/Build/Cesium/ThirdParty",
            to: "ThirdParty"
          },
          { from: "node_modules/cesium/Build/Cesium/Assets", to: "Assets" },
          { from: "node_modules/cesium/Build/Cesium/Widgets", to: "Widgets" }
        ]
      }),
      new webpack.DefinePlugin({
        // Define relative base path in cesium for loading assets
        CESIUM_BASE_URL: JSON.stringify("")
      })
    ],
    module: {
      // Removes these errors: "Critical dependency: require function is used in a way in which dependencies cannot be statically extracted"
      // https://github.com/AnalyticalGraphicsInc/cesium-webpack-example/issues/6
      unknownContextCritical: false,
      unknownContextRegExp: /\/cesium\/cesium\/Source\/Core\/buildModuleUrl\.js/
    }
  }
};
```

### Map.vue

```vue
<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import "cesium/Build/Cesium/Widgets/widgets.css";
import * as Cesium from "cesium";

export default {
  name: "Map",
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let viewer = new Cesium.Viewer("cesiumContainer");

      let imageryLayers = viewer.imageryLayers;

      let googleMap = new Cesium.UrlTemplateImageryProvider({
        url: "http://www.google.com/maps/vt?lyrs=s@716&x={x}&y={y}&z={z}"
      });

      imageryLayers.addImageryProvider(googleMap);

      // fly
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          114.296063,
          30.55245,
          20000000
        ),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-90),
          roll: 0.0
        },
        duration: 10 // fly time 10s
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#cesiumContainer {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
```

## WeChat Official Accounts

<img src="https://open.weixin.qq.com/qr/code?username=gh_11f860dcf461" width="200" />
