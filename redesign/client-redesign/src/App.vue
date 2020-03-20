<template>
  <div id="app"
    class="l-wrapper"
    :class="[{ 'is-home' : isHome }]">
    
    <!-- Header -->
    <Header 
      v-if="!loading"
      :isHome="isHome"
      :cms="cms"></Header>

    <!-- Main -->
    <router-view
      v-if="!loading"
      :cms="cms"></router-view>
    
    <!-- Footer -->
    <Footer
      v-if="!loading"
      :cms="cms"></Footer>
  </div>
</template>

<script>
import axios from 'axios'
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
    return {
      loading: true,
      cms: {}
    };
  },
  created() {
    // @todo: maybe split into calls per route (so far not needed as the dataset is small)
    this.loadData();
  },
  methods: {
    loadData() {
      axios.get(`${this.contentApiBaseUrl}/common`)
        .then(({ data }) => {
          this.cms = data;
          this.loading = false;
        });
    }
  }
}
</script>

<style lang="scss">
@import './assets/styles/main';
</style>
