<template>
  <!-- TODO: Use proper icon -->
  <div class="close">
    <svg :height="size" :width="size">
      <line x1="2" y1="2" :x2="diff" :y2="diff" :style="styleObj" />
      <line :x1="diff" y1="2" x2="2" :y2="diff" :style="styleObj" />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'Close',
  props: {
    size: {
      type: Number,
      default: 12
    },
    thickness: {
      type: Number,
      default: 2
    }
  },
  computed: {
    diff() {
      return this.size - 2;
    },
    styleObj() {
      return `stroke:#000;stroke-width:${this.thickness}`
    }
  },
}
</script>

<style>
</style>