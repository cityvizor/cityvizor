<template>
<div class="container">
    <h1 class="underlined">Technická dokumentace</h1>
    <h2>Licenční podmínky</h2>
    <h3>Zdrojový kód aplikace</h3>
    <p>Ministerstvo financí uvolnilo zdrojové kódy aplikace pod volnou licencí GNU AGPL v3, což mimo jiné znamená, že každý nabyvatel licence, který akceptuje její podmínky, získává právo modifikovat dílo, kopírovat ho a dál rozšiřovat toto dílo i jakoukoli jeho odvozenou verzi. Zároveň to znamená, že každý, kdo provozuje aplikaci po síti, musí nabídnout zdrojové kódy (včetně všech úprav) opět k dispozici pod stejnou licencí.</p>
    <p>Plný text licence najdete na této adrese: <a href="https://www.gnu.org/licenses/agpl-3.0.html">https://www.gnu.org/licenses/agpl-3.0.html</a></p>
    <h3>Zdrojový kód</h3>
    <p>Zdrojový kód aplikace naleznete na GitHubu v repozitáři <a href="https://github.com/cityvizor/cityvizor/">cityvizor/cityvizor</a>. Uvítáme všechny konstruktivní připomínky.</p>
    <h2>Specifikace vstupních dat</h2>
    <p>Za správnost dat odpovídají jednotlivé organizace, které aplikaci využívají. Ministerstvo financí ani spolek Otevřená města za správnost dat nezodpovídají.</p>
    <h3>Formát</h3>
    <p>Data se nahrávají pomocí souborů ve formátu .csv (hodnoty oddělené středníkem, kódování UTF-8, escapovací znak &quot;). Soubory se nahrávají v administraci profilu.</p>
    <h3>Struktura</h3>
<p>Z důvodů zpětné kompatibility i variablity vstupů mohou mít sloupce různé názvy (viz sloupec Alternativní názvy v následujících tabulkách). Zároveň také nezáleží na pořadí sloupců. Sloupce, které jsou označené jako nepovinné jsou nepovinné pro úspěšné vykonání importu, samozřejmě ale bude mít jejich nevyplnění, tam kde je to příslušné, negativní dopad na kvalitu vizualizace (čím méně toho vyplníte, tím méně toho uživatelé uvidí). Pole <em>date</em>, <em>counterpartyId</em>, <em>counterpartyName</em> a <em>description</em> aplikace zpracovává pouze v případě, že se jedná o faktury (tedy pokud <em>type</em> = KDF nebo KOF).</p>
<p>Data můžete nahrát pro každý typ zvlášť (rozpočet, faktury, akce). Můžete také využít tzv. datový soubor, který obsahuje rozpočet a faktury dohromady.</p>
<h3>Průběh importu</h3>
<p>Pokud se v průběhu importu ze souboru vyskytne chyba, pak se nic neuloží. Data se uloží jen tehdy, pokud import proběhne zcela v pořádku. Ve správě profilu si v záložce &quot;Logy importů&quot; můžete ověřit, jestli se daný import povedl a pokud ne, jaká chyba v zdrojovém souboru je. Pokud v importu nahrajete více souborů najednou, každý soubor se importuje zvlášť - pokud tedy nahrajete najednou nevalidní soubor s fakturami a validní soubor s účetnictvím, faktury se neimportují, ale účetnictví ano. Výjimku tvoří nahrávání přes .ZIP soubor, kde se se všechny zabalené soubory nahrají najednou.</p>
<h4>Datový soubor</h4>
<table class="table table-condensed table-hover table-striped">
  <thead>
    <tr><th>Název</th><th>Typ</th><th>Povinné?</th><th>Popis</th></tr>
  </thead>
  <tbody>
    <tr><td>type</td><td>text</td><td>Ano</td><td>Typ záznamu. ROZ = upravený rozpočet, KDF = došlá faktura, KOF = odešlá faktura, jiné nebo prázdné = ostatní záznamy</td></tr>
    <tr><td>paragraph</td><td>číslo</td><td>Ano</td><td>Rozpočtový paragraf</td></tr>
    <tr><td>item</td><td>číslo</td><td>Ano</td><td>Rozpočtová položka</td></tr>
    <tr><td>event</td><td>číslo</td><td>Ne</td><td>Číslo akce dle číselníku</td></tr>
    <tr><td>unit</td><td>číslo</td><td>Ne</td><td>Číslo jednotky dle číselníku</td></tr>
    <tr><td>amount</td><td>částka</td><td>Ano</td><td>Částka v Kč</td></tr>
    <tr><td>date</td><td>datum ve formátu ISO 8601 (YYYY-MM-DD)</td><td>Ne</td><td>Datum, pouze u faktur</td></tr>
    <tr><td>counterpartyId</td><td>text</td><td>Ne</td><td>IČO protistrany, pouze u faktur</td></tr>
    <tr><td>counterpartyName</td><td>text</td><td>Ne</td><td>Jméno protistrany, pouze u faktur</td></tr>
    <tr><td>description</td><td>text</td><td>Ne</td><td>Popis faktury, pouze u faktur</td></tr>
  </tbody>
</table>

<h4>Číselník akcí</h4>
<table class="table table-condensed table-hover table-striped">
  <thead>
    <tr><th>Pole</th><th>Typ</th><th>Povinné?</th><th>Popis</th></tr>
  </thead>
  <tbody>
  <tr><td>srcId</td><td>text</td><td>Ano</td><td>Číslo akce</td></tr>
    <tr><td>name</td><td>text</td><td>Ano</td><td>Název akce</td></tr>
    <tr><td>description</td><td>text</td><td>Ne</td><td>Popis akce, co a proč bylo nakupováno atd.</td></tr>
  </tbody>
</table>

<h3 id="vzorov-data">Vzorová data</h3>
<p>Zde uvádíme několik účetních záznamů v požadované struktuře.</p> 
<p><strong>Vzorový datový soubor</strong></p>
<table class="table table-condensed table-hover table-striped">
  <tr>
    <th>type</th>
    <th>paragraph</th>
    <th>item</th>
    <th>event</th>
    <th>unit</th>
    <th>amount</th>
    <th>date</th>
    <th>counterpartyId</th>
    <th>counterpartyName</th>
    <th>description</th>
  </tr>
  <tr>
    <td>ROZ</td>
    <td>0</td>
    <td>1111</td>
    <td></td>
    <td></td>
    <td>120000</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>ROZ</td>
    <td>5512</td>
    <td>5169</td>
    <td>1</td>
    <td></td>
    <td>66000</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>ROZ</td>
    <td>2212</td>
    <td>5139</td>
    <td>2</td>
    <td>1</td>
    <td>85000</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>KDF</td>
    <td>2212</td>
    <td>5139</td>
    <td>2</td>
    <td></td>
    <td>20000</td>
    <td>2017-01-05</td>
    <td>12345678</td>
    <td>Jiří Novák</td>
    <td>Uhrada za smluvené služby</td>
  </tr>
  <tr>
    <td>KDF</td>
    <td>2212</td>
    <td>5139</td>
    <td>2</td>
    <td></td>
    <td>40000</td>
    <td>2017-02-01</td>
    <td>22345678</td>
    <td>Doprava a.s.</td>
    <td>Uhrada za leden</td>
  </tr>
  <tr>
    <td>KDF</td>
    <td>2212</td>
    <td>5139</td>
    <td>2</td>
    <td></td>
    <td>20000</td>
    <td>2017-03-01</td>
    <td>22345678</td>
    <td>Doprava a.s.</td>
    <td>Uhrada za unor</td>
  </tr>
  <tr>
    <td></td>
    <td>5512</td>
    <td>5169</td>
    <td>1</td>
    <td></td>
    <td>50000</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td></td>
    <td>0</td>
    <td>1111</td>
    <td></td>
    <td></td>
    <td>95000</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>POK</td>
    <td>0</td>
    <td>1340</td>
    <td>3</td>
    <td></td>
    <td>520</td>
    <td>2017-01-08</td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td></td>
    <td>3612</td>
    <td>2132</td>
    <td>126</td>
    <td></td>
    <td>25000</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>KOF</td>
    <td>3612</td>
    <td>2132</td>
    <td>126</td>
    <td></td>
    <td>30000</td>
    <td>2017-09-29</td>
    <td>32345678</td>
    <td>ABC Group, a.s.</td>
    <td>Pronájem prostor právnické osobě – září</td>
  </tr>
  <tr>
    <td>KDF</td>
    <td>3612</td>
    <td>5152</td>
    <td>126</td>
    <td></td>
    <td>11000</td>
    <td>2017-01-11</td>
    <td>42345678</td>
    <td>RWE</td>
    <td>Byty - dodávka tep. energie </td>
  </tr>
  <tr>
    <td>ROZ</td>
    <td>3612</td>
    <td>5152</td>
    <td>126</td>
    <td></td>
    <td>60000</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>ROZ</td>
    <td>3612</td>
    <td>2132</td>
    <td>126</td>
    <td></td>
    <td>70000</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</table>

    <p><strong>Vzorový číselník akcí</strong></p>
    <table class="table table-condensed table-hover table-striped">
    <tr>
        <th>srcId</th>
        <th>name</th>
    </tr>
    <tr>
        <td>1</td>
        <td>Hasičská zbrojnice</td>
    </tr>
    <tr>
        <td>2</td>
        <td>Zimní údržba (ORG)</td>
    </tr>
    <tr>
        <td>3</td>
        <td>Svoz komunálního odpadu</td>
    </tr>
    <tr>
        <td>126</td>
        <td>Bytové hospodářství</td>
    </tr>
    </table>

    <h2>Zpracování dat aplikací</h2>
    <p>CityVizor si neklade za cíl data nijak upravovat kromě zpracování za cílem vizualizace. Z dat tedy nebudou odstraněny osobní údaje v popisech faktur, nebudou skryty vnitřní přesuny ani nebude nijak zasahováno do způsobu vedení rozpočtu obce. Některé změny jsou ale v rámci zpracování nutné a jejich soupis najdete níže.</p>
    <h3>Sečtení duplikovaných záznamů</h3>
    <p>Pokud je ve zdrojových datech dva či více takových záznamů, které mají stejnou položku, paragraf i akci, budou částky u těchto záznamů sečteny a brány jako jeden záznam. Díky tomuto není zpravidla problém s účetními záznamy se zápornou částkou (vratky, opravy apod.), protože jsou sečteny s příslušnými kladnými záznamy. Toto neplatí pro vizualizaci faktur, které budou zobrazeny tak, jak byly ve zdrojových datech.</p>
    <h3>Vynechání nulových záznamů</h3>
    <p>Záznamy, jejichž částka se rovná nule, nebudou ve vizualizaci zobrazeny.</p>
    <h3>Dělení faktur</h3>
    <p>Faktury, které jsou rozdělené do více rozpočtových položek, akcí či paragrafů budou vyzobrazeny tolikrát, v kolika těchto kombinacích budou zařazeny, tj. tak, jak jsou ve vstupních datech. Do budoucna uvažujeme o slučování těchto faktur do jedné, což by ale zvýšilo náročnost importu a vyžadovalo pole čísla faktury.</p>
    
    <h2>API</h2>
    <p>Cityvizor nabízí jednoduché API pro stahování exportů dat. Toto API bude postupně vylepšováno na základě požadavků uživatelů.</p>
    <ul>
        <li>Data mohou být až s hodinovým zpožděním.</li>
        <li>Formát dat lze zvolit hlavičkou Accept, dostupné jsou formáty application/json a text/csv.</li>
    </ul>

    <h4>Profily obcí</h4>
    GET /api/exports/profiles
    <h4>Dostupné roky</h4>
    GET /api/exports/profiles/:profile_id/years
    <h4>Účetnictví</h4>
    GET /api/exports/profiles/:profile_id/accounting/:year
    <h4>Doklady</h4>
    GET /api/exports/profiles/:profile_id/payments/:year
    <h4>Akce</h4>
    GET /api/exports/profiles/:profile_id/events/:year

    <h2>Použité technologie</h2>
    <ul>
        <li>Vue.js</li>
        <li>Angular</li>
        <li>Node.js</li>
        <li>Kotlin</li>
        <li>Postgres</li>
    </ul>
</div>
</template>

<script>
export default {
    name: "DocumentationPage",
}
</script>

<style scoped lang="scss">
@import '../../assets/styles/common/_variables.scss';
table {
  margin-bottom: 24px;
}

h2 {
  margin-top: 24px;
}

ul {
  list-style-type: none;
}

ul li::before {
  content:  "• ";
  color: $primary;
}

</style>