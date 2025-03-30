<template>
  <b-container>
    <b-row class="box-row">
      <h3>{{ header }}</h3>
    </b-row>
    <b-row class="box-row">
      <div>{{ subHeader }}</div>
    </b-row>
    <b-row class="box-row">
      <ModalButton :label="submitButtonLabel" @clicked="$emit('clicked')" />
    </b-row>
  </b-container>
</template>

<script>
import ModalButton from "./ModalButton.vue";

export default {
  name: "ModalBox",
  components: {
    ModalButton,
  },
  props: {
    header: {
      Type: String,
      required: true,
    },
    subHeader: {
      Type: String,
      required: true,
    },
    submitButtonLabel: {
      Type: String,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/common/_variables.scss";

.box-row {
  justify-content: center;
  margin: 10px;
}
</style>
