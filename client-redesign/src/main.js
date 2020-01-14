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
      apiBaseUrl: this.environment === 'production' ? 'https://cityvizor.cesko.digital/api/v2/service/citysearch' : 'http://localhost:1337/citysearch',
      // CMS API
      contentApiBaseUrl: this.environment === 'production' ? '{HERE WILL BE PRODUCTION API URL}' : 'http://localhost:1337'
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
