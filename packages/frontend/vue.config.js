/* eslint-disable no-undef */
// const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
module.exports = {
  lintOnSave: false,
  transpileDependencies: ["vuetify", "vuex-module-decorators"],
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
    performance: {
      hints: false,
    },
  },
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        ws: true,
      },
    },
  },
};
