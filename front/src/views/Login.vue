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
              <v-form v-show="loginFormActive" @submit.prevent="joinGame">
                <v-card-text>
                  <v-text-field
                    label="Game ID"
                    name="gameId"
                    prepend-icon="mdi-alphabetical"
                    type="text"
                    v-model="gameId"
                  />
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn outlined="" @click="loginFormActive = false"
                    >Create game</v-btn
                  >
                  <v-btn color="primary" @click="joinGame">Join</v-btn>
                </v-card-actions>
              </v-form>
            </v-scroll-x-transition>

            <v-scroll-x-transition hide-on-leave>
              <v-form v-show="!loginFormActive" @submit.prevent="createGame">
                <v-card-text>
                  <v-text-field
                    label="Your pseudo"
                    name="creatorPseudo"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="creatorPseudo"
                  />
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn outlined="" @click="loginFormActive = true"
                    >Join game</v-btn
                  >
                  <v-btn color="primary" @click="createGame">Create</v-btn>
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
    return { gameId: "", creatorPseudo: "", loginFormActive: true };
  },
  methods: {
    joinGame() {
      console.log(this.gameId);
    },
    createGame() {
      console.log(this.creatorPseudo);
    }
  }
};
</script>
