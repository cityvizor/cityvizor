<template>
<div>
    <div v-if="this.alternativePageContent.aboutAppHtml" v-html="this.alternativePageContent.aboutAppHtml"></div>
    <div v-else class="container">
        <h1 class="underlined">O aplikaci</h1>
        <p>
            <b>Cityvizor je nástrojem pro transparentní hospodaření obcí.</b> Poskytuje detailní informace o jednotlivých položkách rozpočtu a jeho průběžném plnění. Data jsou získávána přímo z účetních systémů obcí a zobrazována v souvislostech a uživatelsky přívětivou formou.
        </p>
        <p>
            Cílem je zjednodušit přístup k informacím o hospodaření obcí a být užitečným nástrojem obcím, jejich pracovníkům i široké veřejnosti. Aplikace je postavena na principu sdílené služby a byla vyvinuta pracovníky Ministerstva financí. Její provoz zajišťuje spolek <a href="https://www.otevrenamesta.cz/">Otevřená města</a> a partnerem je <a href="https://cesko.digital/">Česko.Digital</a>.
        </p>

        <h2>Přehledně a srozumitelně</h2>
        <p>Prostřednictvím jednoduchých tabulek a grafů aplikace umožňuje seznámit se nejen se strukturou plánovaných výdajů a příjmů obce pro daný rok, ale i s jejich skutečným plněním. Díky možnosti zobrazovat si historická data, lze sledovat také vývoj rozpočtu v minulých letech.</p>
        <p>Výjimečnost Cityvizoru spočívá mimo jiné v tom, že umožňuje třídění výdajů a příjmů podle konkrétních investičních akcí. Díky tomu hned jasně vidíte, za co a komu byly prostředky vyplaceny.</p>

        <h2>Do detailu každé faktury</h2>
        <p>Aplikace zpřístupňuje informace do detailu jednotlivých faktur. V přehledu výdajů se tak můžete podívat nejen o jaký typ výdaje se jedná, ale také na konkrétní akce, se kterými souvisí. Ještě podrobnější informace získáte díky možnosti náhledu na detail dané akce, kde jsou k dispozici kompletní informace o jejím financování.</p>
        <p>Cityvizor zároveň umožňuje zobrazení seznamu všech dodavatelů, kteří se na dané akci podíleli a faktur, které jim byly v souvislosti s touto akcí proplaceny. Vše je pak možné porovnat s financováním akce v minulých letech. Obdobný princip funguje samozřejmě také u příjmů.</p>
        <p>Pokud vás zajímá, komu tento rok vaše obec vyplatila kolik peněz, nemusíte složitě rozklikávat každou položku výdajů a můžete se podívat přímo na faktury, které byly obci proplaceny v konkrétním měsíci vybraného roku.</p>

        <h2>Vše na jednom místě</h2>
        <p>Cityvizor nabízí všechny důležité informace srozumitelně a v souvislostech na jednom místě. Kromě dat o rozpočtech obcí a jejich průběžném plnění ukazuje aplikace také informace z úředních desek (edesky) a z Registru smluv.</p>
        <p>Obec, která chce být vůči občanům transparentní, už nemusí na svém webu zveřejňovat schválené rozpočty nebo faktury, kterým chybí kontext a jejich informační schopnost je proto minimální. Cílem transparentní obce by mělo být zveřejňování všech důležitých informací takovým způsobem, který zachová souvislosti a bude srozumitelný co nejširší veřejnosti.</p>

        <h2>Na míru vašim potřebám</h2>
        <p> Aplikace Cityvizor je neustále zlepšována s ohledem na aktuální potřeby obcí a jejich občanů. Ty jsou zjišťovány průběžným výzkumem a díky zpětné vazbě uživatelů. Aplikaci je navíc možné upravit přesně podle potřeb vaší obce, aby vám přinesla co nejvíce užitku.</p>

        <FeedbackBox></FeedbackBox>
    </div>
</div>
</template>

<script>
import FeedbackBox from "../partials/FeedbackBox.vue"
export default {
    name: "AboutAppPage",
    components: {
        FeedbackBox
    }
}
</script>

<style scoped lang="scss">
</style>