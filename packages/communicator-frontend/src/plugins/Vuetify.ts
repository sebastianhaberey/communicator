import Vue from "vue";
import Vuetify from "vuetify";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      // these colors are copied from variables.scss
      // (they are not used in the application because they cannot be used in css)
      light: {
        primary: "#f0b60a",
        secondary: "#808080",
        accent: "#dba709",
        success: "#4caf50",
        info: "#2196f3",
        warning: "#f0b60a",
        error: "#ff5252",
      },
    },
  },
});
