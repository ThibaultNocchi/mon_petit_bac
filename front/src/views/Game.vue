<template>
  <div>
    <v-navigation-drawer app v-model="drawer">
      <v-list nav>
        <v-list-item
          v-for="player in $store.getters.players"
          :key="player.name"
          two-line
        >
          <v-list-item-avatar>
            <v-avatar color="blue-grey lighten-2"
              ><span class="white--text">{{
                player.name[0].toUpperCase()
              }}</span></v-avatar
            >
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ player.name }}</v-list-item-title>
            <v-list-item-subtitle
              >Score: {{ player.score }}</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-list nav>
          <v-list-item v-if="$store.state.game.game_phase === 0" two-line>
            <!-- <v-list-item-icon
              ><v-icon large>mdi-alphabetical</v-icon></v-list-item-icon
            > -->
            <v-list-item-content>
              <v-list-item-title>{{ $store.state.game.id }}</v-list-item-title>
              <v-list-item-subtitle>Game ID</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-progress-circular
                v-if="$store.state.game.game_phase === 0"
                indeterminate
                rotate
                color="orange"
              ></v-progress-circular>
              <v-icon v-else color="green">mdi-check</v-icon>
            </v-list-item-icon>
            <v-list-item-subtitle v-if="$store.state.game.game_phase === 0"
              >Waiting to start...</v-list-item-subtitle
            >
            <v-list-item-subtitle v-else>Game started!</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
    <v-app-bar app collapse-on-scroll color="blue-grey lighten-2" dense dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Mon Petit Bac</v-toolbar-title>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data() {
    return { drawer: true };
  },
  mounted() {
    if (this.$store.state.game === undefined) {
      this.$router.push("/");
    }
  }
};
</script>
