<template>
  <div>
    <div v-for="html in alternativePageContent.tracking.html" :key="html">
      <div class="hidden" v-html="html"></div>
    </div>
    <div
      v-if="alternativePageContent.footerHtml"
      v-html="alternativePageContent.footerHtml"
    ></div>
    <div v-else>
      <footer class="l-footer" aria-label="Footer">
        <div class="row">
          <div class="col-6">
            <p>
              <router-link to="/dokumentace">Technická dokumentace</router-link>
            </p>
            <p><a href="/login">Vstup do administrace</a></p>
          </div>
          <div class="col-6 text-right">
            <nav>
              <p>
                © <a href="https://www.mfcr.cz/">Ministerstvo financí</a> &
                <a href="https://www.otevrenamesta.cz/">Otevřená města</a>
              </p>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "ComponentsPartialsFooter",
  props: {},
  mounted: function () {
    this.alternativePageContent.tracking.scripts.forEach(script => {
      script = script.replace(/^<script>/, "").replace(/<\/script>$/, "");
      eval(script);
    });
  },
};
</script>

<style scoped lang="scss">
@import "../../assets/styles/main.scss";
.l-footer {
  background-color: $gray;
  padding: 20px;
  margin: 3rem 0 0 0;
}
</style>
