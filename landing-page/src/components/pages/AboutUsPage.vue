<template>
<div>
    <div v-if="this.alternativePageContent.aboutUsHtml" v-html="this.alternativePageContent.aboutUsHtml"></div>
    <div v-else class="container">
        <h1 class="underlined">O nás</h1>
        <p>
            Cityvizor je open-source projekt, původně vyvinutý na Ministerstvu financí České republiky.
        </p>
        <p>
            Provozovatelem projektu je nezisková organizace <a href="https://www.otevrenamesta.cz/">Otevřená města</a>. Tu tvoří spolek obcí, které chtějí být otevřené vůči svým občanům. Jejich cílem je především pomáhat s řešením společných problémů obcí a prostřednictvím spolupráce šetřit jejich čas i peníze.
        </p>
        <p>
            Provozovatelem pro <a href="https://cityvizor.praha.eu/">Prahu a její městské části</a> je společnost <a href="https://operatorict.cz/">Operátor ICT, a.s.</a>, městská akciová společnost, která pro Prahu zajišťuje široké spektrum služeb v oblasti informačních a komunikačních technologií. Cílem společnosti je usnadňovat a vylepšovat život v Praze za pomoci smysluplných a inovativních projektů, které naše hlavní město posouvají na úroveň vyspělé světové metropole.
        </p>
        <p>
            Partnerem projektu je <a href="https://cesko.digital/">Česko.Digital</a>, komunita expertních dobrovolníků napříč obory, kteří pracují na veřejně prospěšných projektech. Chtějí tak ve svém volném čase pomáhat státu i nestátním organizacím dělat Česko lepším místem k životu
        </p>
        <p>
            Společně se snažíme zpřístupnit každému přehledně a srozumitelně všechny důležité informace o hospodaření obcí v ČR. Výjimečnost tohoto projektu spočívá mimo jiné v tom, že se na něm můžete podílet i vy. Pokud chcete podat pomocnou ruku a přispět tak k transparentnímu hospodaření obcí, <a href="https://join.cesko.digital/">připojte se do naší komunity</a>. Těšíme se na spolupráci.
        </p>
        <p>
            Cityvizor je transparentní projekt. Veškerou komunikaci o něm proto najdete na našem <a href="https://cesko-digital.slack.com/archives/CG66HNLH4">Slacku</a> a v <a href="https://trello.com/b/BFJahQYG/cityvizor-organizace">Trellu</a>.
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