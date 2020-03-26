<template>
  <div>
    <v-navigation-drawer stateless app v-model="drawer">
      <template v-slot:prepend>
        <v-list nav>
          <div v-if="$store.state.game.game_phase !== 0">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="title">{{
                  $store.state.game.current_letter
                }}</v-list-item-title>
                <v-list-item-subtitle>Letter</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </div>

          <v-list-item
            v-for="(player, idx) in $store.getters.players"
            :key="idx"
            two-line
            dense
          >
            <v-list-item-avatar>
              <v-avatar
                :color="
                  idx === $store.state.game.user_id
                    ? 'primary'
                    : 'blue-grey lighten-2'
                "
                ><span class="white--text">{{
                  player.name[0].toUpperCase()
                }}</span></v-avatar
              >
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ player.name }}</v-list-item-title>
              <v-list-item-subtitle>
                <span v-if="player.playing">Score: {{ player.score }}</span>
                <span v-else>Waiting next round...</span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
      </template>

      <v-list nav dense>
        <v-list-item
          dense
          v-for="(msg, idx) in $store.state.userMessages"
          :key="idx"
          class="chatMsg"
        >
          <v-list-item-content>
            <v-list-item-title v-text="msg.message"></v-list-item-title>
            <v-list-item-subtitle v-text="msg.sender"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-divider></v-divider>

        <v-list nav>
          <v-list-item>
            <v-list-item-content>
              <v-form @submit.prevent="sendMsg">
                <v-text-field
                  dense
                  outlined
                  label="Send a message"
                  counter="140"
                  v-model="chatMsg"
                ></v-text-field>
              </v-form>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list nav>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>{{ $store.state.game.id }}</v-list-item-title>
              <v-list-item-subtitle>Game ID</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-progress-circular
                v-if="waitingSpinner"
                indeterminate
                rotate
                color="orange"
              ></v-progress-circular>
              <v-icon v-else color="green">mdi-check</v-icon>
            </v-list-item-icon>
            <v-list-item-subtitle>{{ stateMsg }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-app-bar app collapse-on-scroll color="blue-grey lighten-2" dense dark>
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
      <v-toolbar-title>Mon Petit Bac</v-toolbar-title>
    </v-app-bar>

    <v-content class="ma-3">
      <v-container>
        <AddCategories
          v-if="
            $store.state.game.game_phase === 0 &&
              $store.state.game.user_id === 0
          "
        ></AddCategories>

        <Answering
          v-if="
            $store.state.game.game_phase === 1 &&
              $store.getters.currentUserPlaying
          "
        ></Answering>

        <Gathering
          v-if="
            $store.state.game.game_phase === 2 &&
              $store.getters.currentUserPlaying
          "
        ></Gathering>

        <Validation
          v-if="
            $store.state.game.game_phase === 3 &&
              $store.getters.currentUserPlaying
          "
        ></Validation>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import AddCategories from "@/components/AddCategories.vue";
import Answering from "@/components/Answering.vue";
import Gathering from "@/components/Gathering.vue";
import Validation from "@/components/Validation.vue";

export default {
  components: { AddCategories, Answering, Gathering, Validation },
  data() {
    return { drawer: true };
  },
  mounted() {
    if (this.$store.state.game === undefined) {
      this.$router.push("/");
    }
  },
  computed: {
    stateMsg() {
      if (!this.$store.getters.currentUserPlaying) {
        return "Waiting for next round...";
      }
      switch (this.$store.state.game.game_phase) {
        case 0:
          return "Waiting to start...";
        case 1:
          return "Play!";
        case 2:
          return "Gathering all data...";
        case 3:
          return "Validating answers...";
        default:
          return "";
      }
    },
    waitingSpinner() {
      if (!this.$store.getters.currentUserPlaying) {
        return true;
      }
      switch (this.$store.state.game.game_phase) {
        case 1:
          return false;
        default:
          return true;
      }
    },
    chatMsg: {
      get() {
        return this.$store.state.chatMsg;
      },
      set(val) {
        this.$store.commit("setChatMsg", val);
      }
    }
  },
  methods: {
    sendMsg() {
      let obj = {
        action: "message",
        data: { game_id: this.$store.state.game.id, message: this.chatMsg }
      };
      this.$store.dispatch("sendMessage", obj);
    }
  }
};
</script>
