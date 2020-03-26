<template>
  <div>
    <v-row
      dense
      v-for="(player, idx) in $store.getters.playingPlayers"
      :key="idx"
    >
      <v-col cols="12">
        <v-subheader>{{ player.name }}</v-subheader>
      </v-col>
      <v-col
        cols="6"
        sm="4"
        md="3"
        v-for="(cat, idx2) in $store.state.game.cats"
        :key="idx2"
      >
        <v-text-field
          dense
          outlined
          readonly
          :label="cat"
          :value="$store.state.game.current_round[player.id][idx2].value"
          :error="!$store.state.game.current_round[player.id][idx2].valid"
          :success="$store.state.game.current_round[player.id][idx2].valid"
        >
          <template v-slot:append v-if="$store.state.game.user_id === 0">
            <v-icon
              :color="
                $store.state.game.current_round[player.id][idx2].valid
                  ? 'red'
                  : 'green'
              "
              @click="validate(idx, idx2)"
              >mdi-{{
                $store.state.game.current_round[player.id][idx2].valid
                  ? "close"
                  : "check"
              }}</v-icon
            >
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-btn
      fab
      fixed
      bottom
      right
      color="primary"
      large
      :loading="$store.state.socket.loading"
      class="ma-4"
      @click="validate_end"
      v-if="$store.state.game.user_id === 0"
    >
      <v-icon>mdi-check</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "Validation",
  methods: {
    validate(userNb, catNb) {
      let obj = {
        action: "validate",
        data: {
          game_id: this.$store.state.game.id,
          user_pos: userNb,
          answer_pos: catNb
        }
      };
      this.$store.dispatch("sendMessage", obj);
    },
    validate_end() {
      let obj = {
        action: "end_round",
        data: {
          game_id: this.$store.state.game.id
        }
      };
      this.$store.dispatch("sendMessage", obj);
    }
  }
};
</script>
