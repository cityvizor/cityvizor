<template>
<b-container id="participate-box">
    <b-row class="participate-box-row">
        <h3>Chcete Cityvizor i ve vaší obci?</h3>
    </b-row>
    <b-row class="participate-box-row">
        <div>Dejte nám o tom vědět pomocí jednoduchého formuláře.</div>
    </b-row>
    <b-row class="participate-box-row">
        <b-button id="participate-modal-button" @click="open()">Chci zapojit svou obec</b-button>
    </b-row>
    <ModalRequestCity
      v-if="modalOpen === true"
      @close="modalOpen = false" />
</b-container>
</template>

<script>
import ModalRequestCity from "./ModalRequestCity.vue"

export default {
    name: "ParticipateBox",
    components: {
        ModalRequestCity
    },
    data() {
        return {
            modalOpen: false
        }
    },
    methods: {
        open() {
            // TODO: Open the modal. Right now, it requires a city field to open.
            // The city field will be supplied by the user in a new version of the modal.
        }
    }
}
</script>

<style scoped lang="scss">
@import '../../assets/styles/common/_variables.scss';

#participate-box {
	border-radius: 15px;
	border: 2px solid $text-gray;
    margin-bottom: 10px;
}

#participate-modal-button {
    color: $black;
    border: 2px solid $black;
    font-size: 20px;
}

.participate-box-row {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px;
}

</style>