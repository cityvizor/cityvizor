<template>
  <li class="c-municipalities__entry"
    @click="openMunicipality">
    <img v-if="municipality.urlZnak"
      :src="municipality.urlZnak"
      :alt="municipality.nazev"
      class="c-municipalities__entry__heraldry">
    <span v-else
      class="c-municipalities__entry__placeholder"></span>
    <span v-html="highlightSearch(municipality.hezkyNazev || municipality.nazev)"
      class="c-municipalities__entry__label"></span>
    <span class="c-municipalities__entry__region">
      {{ region }}
    </span>
    <small v-if="!municipality.urlCityVizor"
      class="c-municipalities__entry__cta">
      {{ cms.configuration.ctaMunicipality }}
    </small>
  </li>
</template>

<script>
export default {
  props: {
    cms: {
      type: Object,
      default() {
          return {}
      }
    },
    municipality: {
      type: Object
    }
  },
  computed: {
    region() {
      return this.municipality.adresaUradu.kraj;
    }
  },
  methods: {
    highlightSearch(string) {
      const expression = new RegExp(`(${this.searchPhrase})`, 'gi');
      return string.replace(expression, '<strong>$1</strong>');
    },
    openMunicipality() {
      if (this.municipality.urlCityVizor) {
        window.location.href = this.municipality.urlCityVizor;
      }

      // @todo: fallback behavior, probably the contact form?
    }
  }
}
</script>
