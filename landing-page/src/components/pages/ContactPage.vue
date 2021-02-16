<template>
<div>
    <div v-if="this.alternativePageContent.contactHtml" v-html="this.alternativePageContent.contactHtml"></div>
    <div v-else class="container">
        <h1 class="underlined">Kontakt</h1>
        <p>V případě potřeby se na nás obraťte na <a href="mailto:cityvizor@otevrenamesta.cz">cityvizor@otevrenamesta.cz</a>.</p>
        <p>Aplikaci neustále zlepšujeme, aby vám přinesla ještě více užitku. Proto budeme rádi, když se s námi podělíte o své nápady, postřehy či připomínky a uděláme vše proto, aby pro vás byl Cityvizor tím nejlepším řešením.</p>
        
        <h2>Provozovatel projektu</h2>
        <img class="logo" src="@/assets/images/om_logo.png" width="200px"/>
        <p>
            <a href="https://www.otevrenamesta.cz/">Otevřená města, z. s.</a><br/>
            <a href="http://www.openstreetmap.org/?mlat=49.1958&amp;mlon=16.6152#map=16/49.1958/16.6152">Malinovského náměstí 624/3L</a><br/>
            602 00 Brno
        </p>

        <h2>Partner projektu</h2>
        <img class="logo" src="@/assets/images/cesko-digital_logo.png" width="200px"/>
        <p>
            Cityvizor je transparentní projekt, který vzniká ve spolupráci s <a href="https://cesko.digital/">Česko.Digital</a>. Veškerou naši komunikaci o projektu proto najdete na <a href="https://cesko-digital.slack.com/archives/CG66HNLH4">Slacku</a> a v <a href="https://trello.com/b/BFJahQYG/cityvizor-organizace">Trellu</a>.<br/>
            Chcete se na projektu podílet? <a href="https://join.cesko.digital/">Připojte se do naší komunity</a>!
        </p>
        <ParticipateBox></ParticipateBox>
    </div>
</div>
</template>

<script>
import ParticipateBox from "../partials/ParticipateBox.vue"
export default {
    name: "ContactPage",
    components: {
        ParticipateBox
    }
}
</script>

<style scoped lang="scss">
.logo {
    margin-top: 10px;
}
</style>