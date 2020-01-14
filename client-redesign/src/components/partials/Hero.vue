<template>
  <div class="l-partials__hero">
    <!-- Claim -->
    <h2 class="c-hero__claim">
      <strong>Transparentní</strong> hospodaření obcí do detailu každé faktury
    </h2>

    <!-- Search input -->
    <form class="c-hero__search">
      <input 
        type="search" 
        name="search" 
        autocomplete="off"
        v-model="searchPhrase"
        placeholder="Hledat v zapojených obcích">
      <button type="submit" 
        class="btn btn-transparent btn-search">
        Vyhledat
      </button>
    </form>

    <!-- Results container -->
    <div v-show="showMunicipalities">
      <ul class="c-municipalities">
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
          {{ municipality.nazev }}
        </li>
        <li v-if="hasNextPage">

        </li>
      </ul>
    </div>

    <!-- Counter element -->
    <Counter :number="municipalitiesCount"></Counter>
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
  computed: {
    hasPreviousPage() {
      return this.page > 0;
    },
    hasNextPage() {
      return this.municipalities.length > this.page * this.perPage;
    },
    displayedMunicipalities() {
      const clone = JSON.parse(JSON.stringify(this.municipalities));
      return clone.slice(this.page * this.perPage, this.perPage);
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
      municipalitiesCount: 223423413,
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
  methods: {
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
    openMunicipality(municipality) {
      if (municipality.urlCityVizor) {
        window.location.href = municipality.urlCityVizor;
      }
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

.c-hero__claim {
  @extend .type-xl;
  margin: 0 auto;
  color: $body-hero;
  max-width: 780px;
  padding-top: 75px;
  padding-bottom: 75px;
}

.c-hero__search {
  position: relative;
  padding: 25px;
  max-width: 380px;
  margin: 0 auto;

  .btn-search {
    overflow: hidden;
    display: block;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(50%, -50%);
    width: 50px;
    height: 50px;
    text-indent: -9999px;
    background-image: url(./../../assets/images/icons/search.svg);
    background-repeat: no-repeat;
    background-position: center center;
  }
}
</style>
