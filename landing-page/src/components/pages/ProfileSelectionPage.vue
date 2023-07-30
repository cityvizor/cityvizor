<template>
<div class="container">
    <h1>Profil {{this.id}} {{this.profile.name}}</h1>
    <!-- <div v-for="item in tmp" :key="item.name">
      {{ item.name }} {{item.type}}
    </div> -->
    <b-row v-if="loading">
        <b-col>
          <div class="text-center">
            <b-spinner class="loading-right-margin"></b-spinner><span>Načítání zapojených obcí...</span>
          </div>
        </b-col>
    </b-row>
    <div v-if="!loading">
        <Municipalities :municipatilies="municipatilies"></Municipalities>
        <Pbos :pbos="pbos"></Pbos>
    </div>
</div>
</template>

<script>
import Municipalities from "../partials/Municipalities.vue"
import Pbos from '../partials/Pbos.vue';
import axios from 'axios';

export default {
    components: { Municipalities, Pbos },
    name: 'ProfileSelectionPage',
    data() {
    return {
        id: 0,
        loading: true,
        profile: null,
        pbos: [],
        municipatilies: [],
    }
    },
  methods: {
  },
  mounted() {
    this.id = Number(this.$route.params.id);
    axios.get(`${this.apiBaseUrl}/public/profiles/${this.id}/children`, {params: { status: "pending,visible"} })
    .then((response) => {
        let sortedData = response.data.children.sort((a, b) => {
            return a.name.localeCompare(b.name, undefined, {
              numeric: true,
              sensitivity: 'base'
            });
        });

        this.profile = response.data.parent;
        this.pbos = sortedData.filter(profile => profile.type == 'pbo');
        this.municipatilies = sortedData.filter(profile => profile.type =='municipality');
        this.loading = false 
    });
  }
}
</script>

<style lang='scss'>
</style>