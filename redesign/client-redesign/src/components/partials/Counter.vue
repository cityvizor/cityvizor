<template>
  <div class="c-counter">
    Již {{ display }} zapojených obcí!
  </div>
</template>

<script>
const INTERVAL_MS = 50;

export default {
    name: 'ComponentsPartialsCounter',
    props: {
        number: {
            type: Number,
            default: 5
        },
        duration: {
            type: Number,
            default: 1000
        },
    },
    data() {
        return {
            counterInterval: null,
            display: 0,
        }
    },
    computed: {
        step() {
            return this.number / (this.duration / INTERVAL_MS);
        },
    },
    mounted() {
        this.setCounterInterval();
    },
    beforeDestroy() {
        clearInterval(this.counterInterval);
    },
    methods: {
        setCounterInterval() {
            this.counterInterval = setInterval(this.updateNumber, INTERVAL_MS);
        },
        updateNumber() {
            const tick = parseInt(this.step, 10) || 1;
            const targetNumber = this.display + tick; 

            if (targetNumber >= this.number) {
                clearInterval(this.counterInterval);
                this.display = this.number;
            } else {
                this.display = targetNumber;
            }
        }
    },
}
</script>

<style lang="scss">
.c-counter {
    font-size: 48px;
    color: #525252;
    font-weight: 200;
    padding-top: 120px;
    padding-bottom: 120px;
}
</style>
