<template>
<div>
    <div v-if="this.alternativePageContent.aboutUsHtml" v-html="this.alternativePageContent.aboutUsHtml"></div>
    <div v-else class="container">
        <h1 class="underlined">O nás</h1>
        <p>
            Cityvizor je Open Source aplikace, původně vyvinutá na Ministerstvu financí ČR.
        </p>
        <p>
            Aplikaci provozuje a dále vyvíjí nezisková organizace <a href="https://www.otevrenamesta.cz/">Otevřená města</a>. Ta sdružuje obce, které se zajímají o digitalizaci lokálních samospráv a zavádění otevřených řešení do chodu místních úřadů. Cílem Otevřených měst je především pomáhat s řešením společných problémů s digitalizací obcí a prostřednictvím spolupráce šetřit jejich čas i peníze. 
        </p>
        <p>
            Partnerem aplikace bylo do března 2021 <a href="https://cesko.digital/">Česko.Digital</a>, komunita expertních dobrovolníků napříč obory, kteří pracují na veřejně prospěšných projektech. Chtějí tak ve svém volném čase pomáhat státu i nestátním organizacím měnit Česko k lepšímu. Organizaci Česko.Digital patří velký dík, že se nezištně a s velkým nasazením zapojili do rozvoje aplikace Cityvizor a pomohli ji tak opět zlepšit. Těšíme se na další společné projekty.
        </p>
        <p>
            Společně se snažíme zpřístupnit každému přehledně a srozumitelně všechny důležité informace o hospodaření obcí v ČR. Výjimečnost tohoto projektu spočívá mimo jiné v tom, že se na něm můžete podílet i vy. Pokud chcete podat pomocnou ruku a přispět tak k transparentnímu hospodaření obcí, ozvěte se nám na <a href="mailto:cityvizor@otevrenamesta.cz">cityvizor@otevrenamesta.cz</a>. Do předmětu prosím uveďte "[chcipomoctCV]". 
        </p>
        <FeedbackBox></FeedbackBox>
    </div>
</div>
</template>

<script>
import FeedbackBox from "../partials/FeedbackBox.vue"
export default {
    name: "AboutUsPage",
    components: {
        FeedbackBox
    }
}
</script>

<style scoped lang="scss">
</style>