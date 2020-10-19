<template>
  <div class="l-partials__hero">

    <!-- Search input -->
    <div class="c-hero__search">
      <Search
        placeholder="Hledat v zapojených obcích"
        autofocus
        @search="onSearch"
        @loadSuccess="onLoadSuccess"
        @loadFail="onLoadFail" />
    </div>

    <!-- Results container -->
    <div v-show="showMunicipalities">
      <ul class="c-municipalities">
        <li v-if="hasPreviousPage"
          @click="previousPage"
          class="c-municipalities__arrow--left">
          <i class="icon icon-arrow-left"></i>
        </li>
        <Municipality 
          v-for="municipality in displayedMunicipalities"
          :key="municipality.zkratka"
          v-bind="{ municipality }"
        />
        <li v-if="hasNextPage"
          @click="nextPage"
          class="c-municipalities__arrow--right">
          <i class="icon icon-arrow-right"></i>
        </li>
      </ul>
    </div>

    <!-- Counter element -->
    <Counter v-if="municipalitiesCount > 0" :number="municipalitiesCount" :duration="1000"></Counter>
  </div>
</template>

<script>
import axios from 'axios'
import Search from './Search'
import Municipality from './Municipality'
import Counter from './Counter'

export default {
  name: 'ComponentsPartialsHero',
  components: {
    Counter,
    Search,
    Municipality
  },
  props: {
  },
  computed: {
    showMunicipalities() {
      if (this.searchTerm === null) {
        return false
      }
      return this.searchTerm.length > this.searchTermMinLength
    },
    hasPreviousPage() {
      return this.page > 0
    },
    hasNextPage() {
      return this.municipalities.length > this.page * this.perPage + this.perPage
    },
    displayedMunicipalities() {
      const clone = JSON.parse(JSON.stringify(this.municipalities))
      return clone.slice(this.page * this.perPage, this.page * this.perPage + this.perPage)
    }
  },
  data() {
    return {
      searchTerm: null,
      searchTermMinLength: 2,
      municipalitiesCount: 0,
      municipalities: [],
      page: 0,
      perPage: 4,
    }
  },
  mounted() {
    this.loadMunicipalitiesCount();
  },
  methods: {
    previousPage() {
      this.page -= 1;
    },
    nextPage() {
      this.page += 1;
    },
    async loadMunicipalitiesCount() {
      try {
        let response = await axios.get(this.apiBaseUrl + "/knownCities")
        this.municipalitiesCount = response.data.length
      } catch (error) {
        this.onLoadFail(error)
      }
    },
    onSearch(searchTerm) {
      this.searchTerm = searchTerm
    },
    onLoadSuccess(response) {
      this.page = 0;
      this.municipalities = response.data;
      // preload all logos
      this.municipalities
        .filter((municipality) => { return municipality.urlZnak != null })
        .forEach((municipality) => { new Image().src =  municipality.urlZnak }) 
    },
    onLoadFail(error) {
      console.log(error) // eslint-disable-line
    }
  }
}
</script>

<style lang="scss">
@import './../../assets/styles/common/variables';
@import './../../assets/styles/common/typeface';
@import './../../assets/styles/common/helpers';

.l-partials__hero {
  @extend .text-center;
}
</style>
