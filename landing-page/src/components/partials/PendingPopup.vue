<template>
  <div>
    <div
      v-if="pendingPopupOpen"
      class="whole-screen transparent-gray"
      style="z-index: 3"
      @click="pendingPopup()"
    ></div>
    <div v-if="pendingPopupOpen" class="popup" @click="pendingPopup()">
      <div class="popup-text">Data pro tento profil připravujeme</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PendingPopup",
  props: {},
  data() {
    return {
      pendingPopupOpen: false,
    };
  },
  mounted() {},
  methods: {
    pendingPopup() {
      this.pendingPopupOpen = !this.pendingPopupOpen;
    },
  },
};
</script>

<style lang="scss">
@import "../../assets/styles/common/_variables.scss";

.popup {
  position: fixed;
  border-radius: 15px;
  width: 400px;
  height: 150px;
  left: 50%;
  top: 50%;
  z-index: 4;
  background-color: white;
  opacity: 1;
  border: solid 1px $primary;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-text {
  font-size: $font-size-md;
}
</style>
