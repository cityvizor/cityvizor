import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

Vue.mixin({
  data() {
    return {
      apiBaseUrl: this.environment === 'production' ? 'https://cityvizor.cesko.digital/api/v2/service/citysearch' : 'http://localhost:1337/citysearch'
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
