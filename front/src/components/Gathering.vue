<template>
  <div></div>
</template>

<script>
export default {
  name: "Gathering",
  mounted() {
    console.log("gathering started");
    let obj = {
      action: "gather",
      data: { game_id: this.$store.state.game.id }
    };
    obj.data.answers = [];
    for (let i = 0; i < this.$store.state.game.cats.length; ++i) {
      let val = this.$store.state.currentAnswers[i];
      if (val === undefined) {
        obj.data.answers.push("");
      } else {
        obj.data.answers.push(val);
      }
    }
    this.$store.dispatch("sendMessage", obj);
  }
};
</script>
