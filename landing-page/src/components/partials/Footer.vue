<template>
<div>
  <div v-if="this.alternativePageContent.footerHtml" v-html="this.alternativePageContent.footerHtml"></div>
  <div v-else>
    <footer class="l-footer"
        aria-label="Footer">
      <div class="row">
        <div class="col-6">
          <p><router-link to="/dokumentace">Technická dokumentace</router-link></p>
          <p><a href="/login">Vstup do administrace</a></p>
        </div>
        <div class="col-6 text-right">
          <nav>
            <p>Vyvinuto na <a href="https://www.mfcr.cz/">Ministerstvu financí</a></p>
            <p>Provozují <a href="https://www.otevrenamesta.cz/">Otevřená města, z.s.</a></p>
            <p>Server poskytuje <a href="https://vpsfree.cz/" class="text-black"><span style="color:#f6914b">vps</span><span style="color:#000">Free.cz, z.s.</span></a></p>
          </nav>
        </div>
      </div>
    </footer>
  </div>
  <div v-if="this.alternativePageContent.trackingHtml" v-html="this.alternativePageContent.trackingHtml"></div>
</div>
</template>

<script>
export default {
  name: 'ComponentsPartialsFooter',
  props: {
  },
}
</script>