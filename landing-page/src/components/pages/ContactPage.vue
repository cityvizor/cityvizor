<template>
<div>
    <div v-if="this.alternativePageContent.contactHtml" v-html="this.alternativePageContent.contactHtml"></div>
    <div v-else class="container">
        <h1 class="underlined">Kontakt</h1>
        <p>V případě potřeby se na nás obraťte na <a href="mailto:cityvizor@otevrenamesta.cz">cityvizor@otevrenamesta.cz</a>, nebo na <a href="mailto:cityvizor@operatorict.cz">cityvizor@operatorict.cz</a>, pokud se dotaz týká Prahy a jejich městských částí.</p>
        <p>Aplikaci neustále zlepšujeme, aby vám přinesla ještě více užitku. Proto budeme rádi, když se s námi podělíte o své nápady, postřehy či připomínky a uděláme vše proto, aby pro vás byl Cityvizor tím nejlepším řešením.</p>
        
        <h2>Provozovatel aplikace na doméně <a href="https://cityvizor.cz/">cityvizor.cz</a></h2>
        <a href="https://www.otevrenamesta.cz/"><img class="logo" src="@/assets/images/om_logo.png" width="200px"/></a>
        <p>
            <a href="https://www.otevrenamesta.cz/">Otevřená města, z. s.</a><br/>
            <a href="http://www.openstreetmap.org/?mlat=49.1958&amp;mlon=16.6152#map=16/49.1958/16.6152">Malinovského náměstí 624/3L</a><br/>
            602 00 Brno
        </p>

        <h2>Provozovatel aplikace na doméně <a href="https://cityvizor.praha.eu/">cityvizor.praha.eu</a></h2>
        <a href="https://operatorict.cz/"><img class="logo" src="@/assets/images/OICT.jpg" width="150px"/></a>
        <p>
            <a href="https://operatorict.cz/">Operátor ICT, a.s.</a><br/>
            <a href="https://www.openstreetmap.org/#map=19/50.10290/14.44617">Dělnická 213/12</a><br/>
            170 00 Praha 7
        </p>
        <h2>Partner aplikace</h2>
        <a href="https://cesko.digital/"><img class="logo" src="@/assets/images/cesko-digital_logo.png" width="150px"/></a>
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