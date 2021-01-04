import Vue from 'vue'
import VueShowdown from 'vue-showdown'
import App from './App.vue'
import router from './router'
import AsyncComputed from 'vue-async-computed'

Vue.config.productionTip = false

Vue.use(VueShowdown, {
  flavor: 'github',
  options: {
    emoji: false,
  },
})

Vue.use(AsyncComputed)

Vue.mixin({
  data() {
    return {
      // Citysearch API
      apiBaseUrl: process.env.VUE_APP_API_BASE_URL
    }
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
