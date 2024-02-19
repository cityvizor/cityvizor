<template>
  <button
    class="c-hamburger btn btn-link btn--hamburger"
    :class="[{ collapsed: !mobileMenuShow }]"
    @click="$emit('click')"
  >
    <span class="c-hamburger--top"></span>
    <span class="c-hamburger--middle"></span>
    <span class="c-hamburger--bottom"></span>
  </button>
</template>

<script>
export default {
  name: "ComponentsPartialsHamburger",
  props: {
    mobileMenuShow: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
