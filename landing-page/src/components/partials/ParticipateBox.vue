<template>
    <div class="participate-box">
        <ModalBox
            header="Chcete Cityvizor i ve vaší obci?"
            subHeader="Dejte nám o tom vědět pomocí jednoduchého formuláře."
            submitButtonLabel="Chci zapojit svou obec"
            @clicked="modalOpen = true" />
        <ModalRequestCity
            v-if="modalOpen === true"
            @close="modalOpen = false" />
    </div>
</template>

<script>
import ModalBox from "./ModalBox.vue"
import ModalRequestCity from "./ModalRequestCity.vue"

export default {
    name: "ParticipateBox",
    components: {
        ModalBox,
        ModalRequestCity
    },
    data() {
        return {
            modalOpen: false
        }
    }
}
</script>
