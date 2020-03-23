import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    socket: {
      connected: false,
      loading: false,
      latest_error: undefined
    },
    game: undefined,

    errors_translation: {
      missing_name: "Pseudo is missing",
      missing_game_id: "Missing game ID",
      wrong_game_id: "Can't find game ID",
      game_started: "Game already started",
      already_connected: "Socket already connected",
      name_taken: "Name already taken"
    }
  },

  getters: {
    translatedError: state => {
      let msg = undefined;
      if (state.socket.latest_error === undefined) {
        msg = undefined;
      } else if (
        state.errors_translation[state.socket.latest_error] === undefined
      ) {
        msg = "Unexpected error";
      } else {
        msg = state.errors_translation[state.socket.latest_error];
      }
      return msg;
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
      state.socket.loading = false;
      let parsed = JSON.parse(message.data);

      if (
        parsed.type === undefined ||
        (parsed.type !== "error" && parsed.type !== "game")
      ) {
        Vue.prototype.$socket.close();
      }

      if (parsed.type === "error") {
        state.socket.latest_error = parsed.error;
      } else {
        state.game = parsed.game;
        state.socket.latest_error = undefined;
        console.log(state.game);
      }
    },

    clearError(state) {
      state.socket.latest_error = undefined;
    }
  },

  actions: {
    sendMessage: function(context, message) {
      context.state.socket.loading = true;
      Vue.prototype.$socket.send(JSON.stringify(message));
    }
  },
  modules: {}
});
