import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    socket: {
      connected: false
    }
  },
  mutations: {
    SOCKET_ONOPEN(state) {
      state.socket.connected = true;
      console.log("Socket opened");
    },
    SOCKET_ONCLOSE(state) {
      state.socket.connected = false;
      console.log("Socket closed");
    },
    SOCKET_ONERROR(state, event) {
      state.socket.connected = false;
      console.error(state, event);
    },
    SOCKET_ONMESSAGE(state, message) {
      console.error(state, message);
    }
  },
  actions: {},
  modules: {}
});
