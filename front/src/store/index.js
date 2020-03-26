import Vue from "vue";
import Vuex from "vuex";
import router from "../router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    socket: {
      connected: false,
      loading: false,
      latest_error: undefined
    },
    game: undefined,
    currentAnswers: [],
    userMessages: [],
    chatMsg: "",

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
    },

    players: state => {
      let res = [];
      for (let i = 0; i < state.game.names.length; ++i) {
        res.push({
          name: state.game.names[i].name,
          score: state.game.scores[i]
        });
      }
      return res;
    }
  },

  mutations: {
    SOCKET_ONOPEN(state) {
      state.socket.connected = true;
    },

    SOCKET_ONCLOSE(state) {
      state.socket.connected = false;
    },

    SOCKET_ONERROR(state) {
      state.socket.connected = false;
    },

    SOCKET_ONMESSAGE(state, message) {
      state.socket.loading = false;
      let parsed = JSON.parse(message.data);

      if (
        parsed.type === undefined ||
        (parsed.type !== "error" &&
          parsed.type !== "game" &&
          parsed.type !== "message" &&
          parsed.type !== "ackMessage")
      ) {
        Vue.prototype.$socket.close();
      }

      if (parsed.type === "error") {
        state.socket.latest_error = parsed.error;
      } else if (parsed.type === "message") {
        state.userMessages.push({
          message: parsed.message,
          sender: parsed.sender
        });
      } else if (parsed.type === "ackMessage") {
        state.chatMsg = "";
      } else {
        let redirect = false;
        if (state.game === undefined) {
          redirect = true;
        }
        state.game = parsed.game;
        state.socket.latest_error = undefined;
        if (redirect) {
          router.push("/game");
        }
      }
    },

    clearError(state) {
      state.socket.latest_error = undefined;
    },

    updateCurrentAnswers(state, { el, idx }) {
      state.currentAnswers[idx] = el;
    },

    clearCurrentAsnwers(state) {
      state.currentAnswers = [];
    },

    setChatMsg(state, val) {
      state.chatMsg = val;
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
