<template>
  <div class="c-counter">
    Již {{ display }} zapojených obcí!
  </div>
</template>

<script>
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
        steps: {
            type: Number,
            default: 500
        }
    },
    data() {
        return {
            counterInterval: null,
            display: 0,
        }
    },
    mounted() {
        this.setCounterInterval();
    },
    methods: {
        setCounterInterval() {
            this.counterInterval = setInterval(this.updateNumber, this.duration / this.steps);
        },
        updateNumber() {
            const tick = parseInt(this.number / this.steps, 10);
            const targetNumber = this.display + tick;

            if (targetNumber > this.number) {
                clearInterval(this.counterInterval);
                this.display = this.number;
            } else {
                this.display = targetNumber;
            }
        }
    }
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
