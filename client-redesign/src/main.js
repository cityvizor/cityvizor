import Vue from 'vue'
import VueShowdown from 'vue-showdown'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

Vue.use(VueShowdown, {
  flavor: 'github',
  options: {
    emoji: false,
  },
})

Vue.mixin({
  data() {
    return {
      // Citysearch API
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:1337/citysearch',
      // CMS API
      contentApiBaseUrl: process.env.CONTENT_API_BASE_URL || 'http://localhost:1337'
    };
  },
  computed: {
    environment() {
      return process.env.NODE_ENV;
    }
  }
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
