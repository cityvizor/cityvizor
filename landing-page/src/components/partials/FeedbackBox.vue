<template>
<b-container id="feedback-box">
    <b-row class="feedback-box-row">
        <h3>Máte nápady a připomínky k aplikaci Cityvizor?</h3>
    </b-row>
    <b-row class="feedback-box-row">
        <div>Budeme rádi, když se o ně s námi podělíte.</div>
    </b-row>
    <b-row class="feedback-box-row">
        <b-button id="feedback-modal-button" @click="open()">Chci dát zpětnou vazbu</b-button>
    </b-row>
</b-container>
</template>

<script>
export default {
    name: "FeedbackBox",
    components: {
    },
    data() {
        return {
            modalOpen: false
        }
    },
    methods: {
        open() {
            // TODO: Open the feedback form. Not implemented yet.
        }
    }
}
</script>

<style scoped lang="scss">
@import '../../assets/styles/common/_variables.scss';

#feedback-box {
	border-radius: 15px;
	border: 2px solid $text-gray;
    margin-bottom: 10px;
}

#feedback-modal-button {
    color: $black;
    border: 2px solid $black;
    font-size: 20px;
}

.feedback-box-row {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px;
}

</style>