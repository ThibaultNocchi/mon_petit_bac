<template>
  <div>
    <v-row dense>
      <v-col
        cols="12"
        sm="6"
        md="4"
        v-for="(cat, idx) in $store.state.game.cats"
        :key="idx"
      >
        <v-text-field
          @input="e => setAnswers(e, idx)"
          outlined
          :label="cat"
        ></v-text-field>
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
      @click="first"
    >
      <v-icon>mdi-check</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "Answering",
  mounted() {
    this.$store.commit("clearCurrentAsnwers");
  },
  methods: {
    first() {
      let obj = {
        action: "first",
        data: { game_id: this.$store.state.game.id }
      };
      this.$store.dispatch("sendMessage", obj);
    },
    setAnswers(el, idx) {
      this.$store.commit("updateCurrentAnswers", { el, idx });
    }
  }
};
</script>
