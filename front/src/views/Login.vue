<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Mon Petit Bac</v-toolbar-title>
            </v-toolbar>

            <v-scroll-x-transition hide-on-leave>
              <v-form
                v-show="connectForm && !gameIdFilled"
                @submit.prevent="
                  $store.commit('clearError');
                  gameIdFilled = true;
                "
              >
                <v-card-text>
                  <v-text-field
                    label="Game ID"
                    name="gameId"
                    prepend-icon="mdi-alphabetical"
                    type="text"
                    v-model="gameId"
                    :error-messages="$store.getters.translatedError"
                  />
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    :disabled="$store.state.socket.loading"
                    outlined=""
                    @click="
                      $store.commit('clearError');
                      connectForm = false;
                    "
                    >Create a game</v-btn
                  >
                  <v-btn
                    color="primary"
                    @click="
                      $store.commit('clearError');
                      gameIdFilled = true;
                    "
                    >Connect</v-btn
                  >
                </v-card-actions>
              </v-form>
            </v-scroll-x-transition>

            <v-scroll-x-transition hide-on-leave>
              <v-form
                v-show="connectForm && gameIdFilled"
                @submit.prevent="
                  $store.commit('clearError');
                  joinGame();
                "
              >
                <v-card-text>
                  <v-text-field
                    label="Your pseudo"
                    name="pseudo"
                    prepend-icon="mdi-account"
                    type="text"
                    autofocus
                    v-model="pseudo"
                    :error-messages="$store.getters.translatedError"
                  />
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    :disabled="$store.state.socket.loading"
                    outlined=""
                    @click="
                      $store.commit('clearError');
                      gameIdFilled = false;
                    "
                    >Back</v-btn
                  >
                  <v-btn
                    color="primary"
                    @click="
                      $store.commit('clearError');
                      joinGame();
                    "
                    >Connect</v-btn
                  >
                </v-card-actions>
              </v-form>
            </v-scroll-x-transition>

            <v-scroll-x-transition hide-on-leave>
              <v-form
                v-show="!connectForm"
                @submit.prevent="
                  $store.commit('clearError');
                  createGame();
                "
              >
                <v-card-text>
                  <v-text-field
                    label="Your pseudo"
                    name="pseudo"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="pseudo"
                    :error-messages="$store.getters.translatedError"
                  />
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    :disabled="$store.state.socket.loading"
                    outlined=""
                    @click="
                      $store.commit('clearError');
                      connectForm = true;
                    "
                    >Connect to a game</v-btn
                  >
                  <v-btn
                    color="primary"
                    @click="
                      $store.commit('clearError');
                      createGame();
                    "
                    >Create</v-btn
                  >
                </v-card-actions>
              </v-form>
            </v-scroll-x-transition>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
export default {
  data() {
    return {
      gameId: "",
      pseudo: "",
      connectForm: true,
      gameIdFilled: false
    };
  },
  methods: {
    joinGame() {
      let obj = {
        action: "connect",
        data: { name: this.pseudo, game_id: this.gameId }
      };
      this.$store.dispatch("sendMessage", obj);
    },
    createGame() {
      let obj = { action: "create", data: { name: this.pseudo } };
      this.$store.dispatch("sendMessage", obj);
    }
  }
};
</script>
