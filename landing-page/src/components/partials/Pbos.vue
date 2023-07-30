<template>
  <div class="container">
    <h2>Příspěvkové organizace</h2>
    <div v-for="item in pbos" :key="item.name">
      {{ item.name }} <!-- Assume that each item has 'id' and 'name' properties -->
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfileSelectionPage",
  props: {
    pbos: {
      type: Array,
      required: true,
    },
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