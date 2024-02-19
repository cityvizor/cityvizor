<template>
  <div class="participate-box">
    <ModalBox
      header="Chcete Cityvizor i ve vaší obci?"
      sub-header="Dejte nám o tom vědět pomocí jednoduchého formuláře."
      submit-button-label="Chci zapojit svou obec"
      @clicked="modalOpen = true"
    />
    <ModalRequestCity v-if="modalOpen === true" @close="modalOpen = false" />
  </div>
</template>

<script>
import ModalBox from "./ModalBox.vue";
import ModalRequestCity from "./ModalRequestCity.vue";

export default {
  name: "ParticipateBox",
  components: {
    ModalBox,
    ModalRequestCity,
  },
  data() {
    return {
      modalOpen: false,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/common/_variables.scss";
.participate-box {
  border-radius: 15px;
  border: 1px solid $text-gray;
  margin-top: 64px;
  margin-bottom: 64px;
}
</style>
