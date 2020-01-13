<template>
  <div class="l-partials__hero">
    <h2 class="c-hero__claim">
      <strong>Transparentní</strong> hospodaření obcí do detailu každé faktury
    </h2>
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
    <div v-show="showMunicipalities">
      <ul class="c-municipalities">
        <li v-for="municipality in filteredMunicipalities"
          :key="municipality.ICO">
          {{ municipality.adresaUradu.obecNazev }}
          <span v-if="municipality.adresaUradu.castObceNeboKatastralniUzemi && municipality.adresaUradu.obecNazev !== municipality.adresaUradu.castObceNeboKatastralniUzemi"
            class="divider">
            -
          </span>
          <span v-if="municipality.adresaUradu.castObceNeboKatastralniUzemi && municipality.adresaUradu.obecNazev !== municipality.adresaUradu.castObceNeboKatastralniUzemi">
            {{ municipality.adresaUradu.castObceNeboKatastralniUzemi }}
          </span>
        </li>
      </ul>
    </div>
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
    filteredMunicipalities() {
      if (this.searchPhrase === null) {
        return [];
      }
      const filter = this.searchPhrase.toLowerCase();
      return this.municipalities.filter(item => {
        return item.nazev.toLowerCase().indexOf(filter) !== -1;
      });
    },
    showMunicipalities() {
      if (this.searchPhrase === null) {
        return false;
      }
      return this.searchPhrase.length > 2;
    }
  },
  data() {
    return {
      searchTimeout: null,
      searchDebounce: 300,
      searchPhrase: null,
      municipalitiesCount: 223423413,
      municipalities: [],
      municipalitiesLoaded: false,
      municipalitiesLoading: false,
    }
  },
  watch: {
    searchPhrase() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      if (!this.municipalitiesLoaded) {
        this.searchTimeout = setTimeout(this.loadMunicipalities, this.searchDebounce);
      }
    },
  },
  methods: {
    loadMunicipalities() {
      this.municipalitiesLoading = true;
      axios.get('/obce.json')
        .then(response => {
          this.municipalitiesLoading = false;
          this.municipalitiesLoaded = true;
          this.municipalities = response.data;
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
