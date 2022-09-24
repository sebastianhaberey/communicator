import * as log from "loglevel";

import Vue, { VNode } from "vue";

import router from "./plugins/Router";
import vuetify from "./plugins/Vuetify";

import App from "./App.vue";

Vue.config.productionTip = false;

log.setLevel(log.levels.DEBUG);

new Vue({
  router,
  vuetify,
  render: (h): VNode => h(App),
}).$mount("#app");
