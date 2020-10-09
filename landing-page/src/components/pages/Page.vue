<template>
    <main class="l-page" :class="{ 'l-page--custom-page': customPage }">
        <div class="container">
            <h1 id="page--heading" v-html="page.Title"></h1>
        </div>
            
        <component v-if="customPage" :is="customPage"></component>
        <div v-else-if="page" class="container">
            <vue-showdown v-for="blockitem in page.Block"
                :key="blockitem.id"
                :markdown="blockitem.Content"/>
        </div>
    </main>
</template>

<script>
import WhyPage from './CustomPages/WhyPage';

const customPages = {
    'proc-cityvizor': WhyPage,
};

export default {
  name: 'ComponentsPagesPage',
  props: {
      routes: {
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
      customPage() {
          const slug = this.$route.params.slug;
          if (!Object.keys(routes).includes(slug)) {
              return null;
          }

          return customPages[slug];
      },
      page() {
          const page = this.routes.keys.find(item => item.Slug === this.$route.params.slug);

          if (page) {
              return page;
          }

          return this.errorNotFoundPage;
      }
  }
}
</script>

<style lang="scss">
#page--heading {
    text-align: center;
    padding-bottom: 98px;
}
</style>
