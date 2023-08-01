<template>
  <div id="app"
    class="l-wrapper">
    <!-- Header -->
    <Header></Header>

    <!-- Main -->
    <router-view id="main"></router-view>
    
    <!-- Footer -->
    <Footer></Footer>
  </div>
</template>

<script>
import Header from './components/partials/Header.vue'
import Footer from './components/partials/Footer.vue'

export default {
  name: 'app',
  components: {
    Header,
    Footer
  },
  computed: {
    isHome() {
      return this.$route.path === '/';
    }
  },
  data() {
    return {}
  },
  created() {
  },
  methods: {
  }
}
</script>

<style lang="scss">
  #main {
    max-width: 70vw;
    margin: 0 auto;
  }
</style>
