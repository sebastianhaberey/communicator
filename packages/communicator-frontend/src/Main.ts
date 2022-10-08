import * as log from "loglevel";

import Vue, { VNode } from "vue";

import store from "./store/Store";
import router from "./plugins/Router";
import vuetify from "./plugins/Vuetify";

import App from "./App.vue";

import "@fontsource/vollkorn/900.css";

Vue.config.productionTip = false;

log.setLevel(log.levels.DEBUG);

new Vue({
  store,
  router,
  vuetify,
  render: (h): VNode => h(App),
}).$mount("#app");
