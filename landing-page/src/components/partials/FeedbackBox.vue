<template>
    <div class="feedback-box">
        <ModalBox
            header="Máte nápady a připomínky k aplikaci Cityvizor?"
            subHeader="Budeme rádi, když se o ně s námi podělíte."
            submitButtonLabel="Chci dát zpětnou vazbu"
            @clicked="modalOpen = true" />
        <ModalFeedback
            v-if="modalOpen === true"
            @close="modalOpen = false" />
    </div>
</template>

<script>
import ModalBox from "./ModalBox.vue"
import ModalFeedback from "./ModalFeedback.vue"

export default {
    name: "FeedbackBox",
    components: {
        ModalBox,
        ModalFeedback
    },
    data() {
        return {
            modalOpen: false
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../assets/styles/common/_variables.scss';
.feedback-box {
	border-radius: 15px;
	border: 2px solid $text-gray;
    margin-top: 64px;
    margin-bottom: 64px;
}
</style>