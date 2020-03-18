<template>
  <div class="l-partials__hero">
    <!-- Claim -->
    <h2 class="c-hero__claim"
      v-html="cms.configuration.Claim">
    </h2>

    <!-- Search input -->
    <form class="c-hero__search">
      <input 
        type="search" 
        name="search" 
        autocomplete="off"
        v-model="searchPhrase"
        placeholder="Hledat v zapojených obcích">
      <button type="button" 
        class="btn btn-transparent btn-search"
        @click="loadMunicipalities">
        {{ cms.configuration.SearchLabel }}
      </button>
    </form>

    <!-- Results container -->
    <div v-show="showMunicipalities">
      <ul class="c-municipalities">
        <li v-if="hasPreviousPage"
          @click="previousPage"
          class="c-municipalities__arrow--left">
          <i class="icon icon-arrow-left"></i>
        </li>
        <li v-for="municipality in displayedMunicipalities"
          :key="municipality.zkratka"
          class="c-municipalities__entry"
          @click="openMunicipality(municipality)">
          <img v-if="municipality.urlZnak"
            :src="municipality.urlZnak"
            :alt="municipality.nazev"
            class="c-municipalities__entry__heraldry">
          <span v-else
            class="c-municipalities__entry__placeholder"></span>
          <span v-html="highlightSearch(municipality.nazev)"
            class="c-municipalities__entry__label"></span>
          <small v-if="!municipality.urlCityVizor"
            class="c-municipalities__entry__cta">
            {{ cms.configuration.ctaMunicipality }}
          </small>
        </li>
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
import axios from 'axios';
import Counter from './Counter';

export default {
  name: 'ComponentsPartialsHero',
  components: {
    Counter,
  },
  props: {
    cms: {
      type: Object,
      default() {
          return {}
      }
    }
  },
  computed: {
    hasPreviousPage() {
      return this.page > 0;
    },
    hasNextPage() {
      return this.municipalities.length > this.page * this.perPage + this.perPage;
    },
    displayedMunicipalities() {
      const clone = JSON.parse(JSON.stringify(this.municipalities));
      return clone.slice(this.page * this.perPage, this.page * this.perPage + this.perPage);
    },
    showMunicipalities() {
      if (this.searchPhrase === null) {
        return false;
      }
      return this.searchPhrase.length > this.searchMinimumLength;
    }
  },
  data() {
    return {
      searchTimeout: null,
      searchDebounce: 600,
      searchPhrase: null,
      searchMinimumLength: 2,
      municipalitiesCount: 0,
      municipalities: [],
      page: 0,
      perPage: 4,
    }
  },
  watch: {
    searchPhrase() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout = setTimeout(this.loadMunicipalities, this.searchDebounce);
    },
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
    highlightSearch(string) {
      const expression = new RegExp(`(${this.searchPhrase})`, 'gi');
      return string.replace(expression, '<strong>$1</strong>');
    },
    loadMunicipalities() {
      axios.get(this.apiBaseUrl, {
        params: {
          query: this.searchPhrase
        }
      })
      .then(response => {
        this.municipalities = response.data;
        this.page = 0;
      })
      .catch(error => {
        console.log(error); // eslint-disable-line
      });
    },
    loadMunicipalitiesCount() {
      axios.get(this.apiBaseUrl)
      .then(response => {
        this.municipalitiesCount = response.data.length;
      })
      .catch(error => {
        console.log(error); // eslint-disable-line
      });
    },
    openMunicipality(municipality) {
      if (municipality.urlCityVizor) {
        window.location.href = municipality.urlCityVizor;
      }

      // @todo: fallback behavior, probably the contact form?
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
