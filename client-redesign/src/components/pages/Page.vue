<template>
    <div class="l-page">
        <div class="container"
            v-if="page">
            <h1 v-html="page.Title"></h1>
            <vue-showdown v-for="blockitem in page.Block"
                :key="blockitem.id"
                :markdown="blockitem.Content"/>
        </div>
    </div>
</template>

<script>
export default {
  name: 'ComponentsPagesPage',
  props: {
      cms: {
          type: Object,
          default() {
              return {}
          }
      }
  },
  data() {
      return {
          errorNotFoundPage: {
              Title: '404 Stránka nenalezena',
              Block: [
                  {
                      Content: 'Tato stránka na webu neexistuje'
                  }
              ]
          }
      }
  },
  computed: {
      page() {
          const page = this.cms.pages.find(item => item.Slug === this.$route.params.slug);

          if (page) {
              return page;
          }

          return this.errorNotFoundPage;
      }
  }
}
</script>

<style lang="scss">

</style>
