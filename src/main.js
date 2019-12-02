import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";

import VueSocketIO from "vue-socket.io";

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: "http://localhost:8000"
  })
);

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: h => h(App)
}).$mount("#app");
