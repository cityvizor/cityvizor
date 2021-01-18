<template>
<b-container class="participate-box">
    <b-row class="participate-box-row">
        <h3>{{ header }}</h3>
    </b-row>
    <b-row class="participate-box-row">
        <div>{{ subHeader }}</div>
        </b-row>
    <b-row class="participate-box-row">
        <ModalButton @clicked="$emit('clicked')" :label="submitButtonLabel"/>
    </b-row>
</b-container>
</template>

<script>
import ModalButton from "./ModalButton.vue"

export default {
    name: "ModalBox",
    components: {
        ModalButton
    },
    props: {
        header: {
            Type: String,
            required: true
        },
        subHeader: {
            Type: String,
            required: true
        },
        submitButtonLabel: {
            Type: String,
            required: true
        }
    }
}
</script>

<style scoped lang="scss">
@import '../../assets/styles/common/_variables.scss';

.participate-box {
	border-radius: 15px;
	border: 2px solid $text-gray;
}

.participate-box-row {
    justify-content: center;
    margin: 10px;
}

</style>