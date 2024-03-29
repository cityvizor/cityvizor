<template>
  <b-button class="modal-button" @click="$emit('clicked')">{{
    label
  }}</b-button>
</template>

<script>
export default {
  name: "ButtonBold",
  props: {
    label: {
      type: String,
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/main.scss";

.modal-button {
  background-color: $primary;
  color: $black;
  border: 2px solid $black;
  font-size: 20px;
}
</style>
