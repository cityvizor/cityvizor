<template>
  <form class="search">
    <input
      :ref="searchFieldGuid"
      type="text" 
      name="search" 
      autocomplete="off"
      v-model="searchTerm"      
      :placeholder="placeholder">
    <button
      type="button" 
      class="btn btn-transparent btn-search"
      @click="loadItems">
      {{ searchLabel  }}
    </button>
  </form>
</template>

<script>
import axios from 'axios'
import getGuid from './../../js/get-guid'

export default {
  name: 'Search',
  props: {
    placeholder: {
      type: String,
      required: true
    },
    searchLabel: {
      type: String
    },
    endpoint: {
      type: String,
      required: true
    },
    autofocus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchFieldGuid: null,
      searchTerm: null,
      searchTimeout: null,
      searchDebounce: 600
    }
  },
  created() {
    this.searchFieldGuid = getGuid()
  },
  mounted() {
    if (this.autofocus) {
      this.$refs[this.searchFieldGuid].focus()
    }
  },
  watch: {
    searchTerm() {
      if (this.searchTimeout) clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(this.loadItems, this.searchDebounce)
      this.$emit('search', this.searchTerm)
    }
  },
  methods: {
    async loadItems () {
      try {
        let params = { query: this.searchTerm }
        let response = await axios.get(this.endpoint, { params })
        this.$emit('loadSuccess', response)
      } catch (error) {
        this.$emit('loadFail', error)        
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
