<template>
  <div class="container">
    <h2>Městské obvody</h2>
    <div v-for="item in municipatilies" :key="item.name">
      {{ item.name }} <!-- Assume that each item has 'id' and 'name' properties -->
    </div>
  </div>
</template>

<script>
export default {
  name: "Municipalities",
  props: {
    municipatilies: {
        type: Array,
        required: true
    }
  },
  data() {
    return {};
  },
  methods: {},
  mounted() {},
};
</script>

<style lang='scss'>
</style>