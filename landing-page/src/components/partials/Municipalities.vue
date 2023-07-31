<template>
<div>
   <Pending-popup ref="pendingPopup"></Pending-popup>
  <div class="container">
    <b-row>
        <h2>Městské obvody</h2>
    </b-row>
    <b-row class="list-margin-bottom"> 
        <b-col v-for="muni in  municipatilies" :key="muni.name" class="city-item-margin-top text-justify" md="4" sm="6" xl="3">
          <b-row cols="12" no-gutters>
              <b-col class="city-item-icon-right-margin" cols="1">
                <a class="fake-link" v-if=" muni.status == 'pending'" v-on:click="pendingPopup()">
                  <img src="@/assets/images/pages/home/city_avatar.svg">
                </a>
                <a v-else :target="muni.type == 'external' ? '_blank' : ''" :href="muni.url">
                  <img src="@/assets/images/pages/home/city_avatar.svg">
                </a>
              </b-col>
              <b-col cols="10">
                <a class="fake-link"  v-if=" muni.status == 'pending'" v-on:click="pendingPopup()">
                  <b class="pending">{{ muni.name }}</b>
                </a>
                <a v-else :target="muni.type == 'external' ? '_blank' : ''" :href="'/' + muni.url">
                  <b>{{ muni.name }}</b>
                </a>
              </b-col>
          </b-row>
        </b-col>
    </b-row>
  </div>
</div>
</template>

<script>
import PendingPopup from './PendingPopup.vue';

export default {
  components: { PendingPopup },
  name: "Municipalities",
  props: {
    municipatilies: {
        type: Array,
        required: true
    }
  },
  data() {
    return {
    };
  },
  methods: {
    pendingPopup() {
      this.$refs.pendingPopup.pendingPopup();
    }
  },
  mounted() {},
};
</script>

<style lang='scss'>
@import '../../assets/styles/common/_variables.scss';

a {
  color: #0645ad !important;
  text-decoration: none !important;
}
.city-item-margin-top {
  margin-top: 24px;
}

.list-margin-bottom {
  margin-bottom: 24px;
}

.city-item-icon-right-margin {
  margin-right: 8px;
  max-width: 64px;
}
.loading-right-margin {
  margin-right: 8px;
}

.pending {
  color: grey !important;
}

.fake-link {
  cursor: pointer;
}

.transparent-gray {
  background-color: gray;
  opacity: 0.1;
}
</style>