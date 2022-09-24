import Vue from "vue";
import Vuex from "vuex";
import { ApplicationStore } from "@/store/ApplicationStore";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  modules: {
    ApplicationStore,
  },
});
