import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {
    SOCKET_ONOPEN(state, event) {
      console.error(state, event);
    },
    SOCKET_ONCLOSE(state, event) {
      console.error(state, event);
    },
    SOCKET_ONERROR(state, event) {
      console.error(state, event);
    },
    SOCKET_ONMESSAGE(state, message) {
      console.error(state, message);
    }
  },
  actions: {},
  modules: {}
});
