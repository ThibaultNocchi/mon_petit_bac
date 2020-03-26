<template>
  <div>
    <v-icon size="130" color="orange" class="mb-4">mdi-clock-fast</v-icon>
    <div class="display-1 font-weight-light">{{ text }}</div>
  </div>
</template>
<script>
export default {
  name: "WaitingScreen",
  props: {
    text: {
      required: true,
      type: String
    }
  }
};
</script>
