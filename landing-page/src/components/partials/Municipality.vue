<template>
  <li class="c-municipalities__entry" @click="openMunicipality">
    <img
      v-if="municipality.urlZnak"
      :src="municipality.urlZnak"
      :alt="municipality.nazev"
      class="c-municipalities__entry__heraldry"
    />
    <span v-else class="c-municipalities__entry__placeholder"></span>
    <span
      class="c-municipalities__entry__label"
      v-html="highlightSearch(municipality.hezkyNazev || municipality.nazev)"
    ></span>
    <span class="c-municipalities__entry__region">
      {{ region }}
    </span>
  </li>
</template>

<script>
export default {
  name: "Municipality",
  props: {
    municipality: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      modalOpen: false,
    };
  },
  computed: {
    region() {
      return this.municipality.adresaUradu.kraj;
    },
  },
  methods: {
    highlightSearch(string) {
      const expression = new RegExp(`(${this.searchPhrase})`, "gi");
      return string.replace(expression, "<strong>$1</strong>");
    },
    openMunicipality() {
      if (this.municipality.urlCityVizor) {
        window.location.href = this.municipality.urlCityVizor;
      } else {
        this.modalOpen = true;
      }

      // @todo: fallback behavior, probably the contact form?
    },
  },
};
</script>
