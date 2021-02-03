import Vue from 'vue'
import App from './App.vue'
import router from './router'
import AsyncComputed from 'vue-async-computed'
import VueToastr from "vue-toastr";
import axios from "axios"

Vue.config.productionTip = false
Vue.use(AsyncComputed)
Vue.use(VueToastr);

axios.get(`${process.env.BASE_URL}/cfg/content.json`)
    .then((response) => {
      Vue.mixin({
        data() {
          return {
            // Citysearch API
            apiBaseUrl: process.env.VUE_APP_API_BASE_URL,
            alternativePageContent: response.data
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
  })

