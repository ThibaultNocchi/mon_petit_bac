import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueNativeSock from "vue-native-websocket";
import VueClipboard from "vue-clipboard2";

Vue.config.productionTip = false;

let socketUrl = "ws://" + window.location.hostname + ":8081";
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
