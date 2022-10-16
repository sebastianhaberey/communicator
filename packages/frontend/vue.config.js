/* eslint-disable no-undef */
module.exports = {
  lintOnSave: false,
  transpileDependencies: ["vuetify", "vuex-module-decorators"],
  configureWebpack: {
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
