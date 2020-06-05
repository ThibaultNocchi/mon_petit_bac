import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueNativeSock from "vue-native-websocket";
import VueClipboard from "vue-clipboard2";

Vue.config.productionTip = false;

let DEFAULT_URL = "ws://" + window.location.hostname + ":8081";

let socketUrl =
  process.env.VUE_APP_BACK_HOST === undefined
    ? DEFAULT_URL
    : process.env.VUE_APP_BACK_HOST;

Vue.use(VueNativeSock, socketUrl, {
  store: store
});

Vue.use(VueClipboard);

new Vue({
  router,
  store,
  vuetify,

  render: function(h) {
    return h(App);
  }
}).$mount("#app");
