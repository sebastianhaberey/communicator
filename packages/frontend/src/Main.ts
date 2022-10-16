import * as log from "loglevel";

import Vue, { VNode } from "vue";

import vuetify from "./plugins/Vuetify";

import App from "./App.vue";

import "@fontsource/mouse-memoirs";

Vue.config.productionTip = false;

log.setLevel(log.levels.DEBUG);

new Vue({
  vuetify,
  render: (h): VNode => h(App),
}).$mount("#app");
