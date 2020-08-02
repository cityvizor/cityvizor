<template>
  <div class="l-partials__hero">
    <!-- Claim -->
    <h2 class="c-hero__claim"
      v-html="cms.configuration.Claim">
    </h2>

    <!-- Search input -->
    <form class="c-hero__search" v-on:submit.prevent="loadMunicipalities">
      <input 
        type="text" 
        name="search"
        :ref="searchFieldGuid"
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
        <Municipality 
          v-for="municipality in displayedMunicipalities"
          :key="municipality.zkratka"
          v-bind="{ municipality, cms }"
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
import axios from 'axios';
import getGuid from './../../js/get-guid'

import Counter from './Counter';
import Municipality from './Municipality'

export default {
  name: 'ComponentsPartialsHero',
  components: {
    Counter,
    Municipality
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
      searchFieldGuid: null,
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
  created () {
    this.searchFieldGuid = getGuid()
  },
  mounted() {
    this.loadMunicipalitiesCount();
    this.$refs[this.searchFieldGuid].focus()
  },
  methods: {
    previousPage() {
      this.page -= 1;
    },
    nextPage() {
      this.page += 1;
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
        
        // preload all logos
        this.municipalities
          .filter((municipality) => { return municipality.urlZnak != null })
          .forEach((municipality) => { new Image().src =  municipality.urlZnak }) 
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
