<template>
<div class="container">
    <h1>Úvod</h1>
    <p>Tento návod popisuje proces importu dat do aplikace přes administraci pomocí dat ve formátu <i>csv</i>, popsaném v <router-link to="dokumentace">technické dokumentaci</router-link>.</p>
    <h2>Vytvoření rozpočtového roku</h2>
    Pokud profil, do kterého chceme importovat data ještě nemá vytvořený rozpočtový rok, je potřeba ho vytvořit. V profilu klikneme na modré tlačítko "Přidat rozpočtový rok" a ve formuláři zadáme rok, který chceme vytvořit a případně ho nastavíme jako skrytý pokud nechceme, aby byl hned vidět v profilu obce. Ostatní políčka nevyplňujeme.</p>
    <img src="@/assets/images/import-guide/create-year.png">
    <img src="@/assets/images/import-guide/year-form.png">
    <h2>Import dat</h2>
    <p>Ve zvoleném roku klikneme na tlačítko "Další" a poté na "Nahrát data z CSV". V následném dialogu nahrajeme příslušné soubory a nastavíme, jestli se data mají nahradit, nebo přidat. Validitu dat nastavíme libovolně. Datový soubor obsahuje záznamy s rozpočtem a fakturami, ostatní soubory obsahují pouze položky dané názvem. Pokud zvolíme "Nahradit data", pak se staré záznamy vymažou a nahradí novými, např. pokud nahráváme kompletní účetnictví. Pokud zvolíme "Přidat data", pak se nové záznamy přidají k těm stávajícím, např. pokud chceme nahrát nové faktury za poslední měsíc. Pozor, duplicita dat není nijak kontrolována! Formulář odešleme tlačítkem "Nahrát".</p>
    <img src="@/assets/images/import-guide/open-upload-form.png">
    <img src="@/assets/images/import-guide/upload-form.png">
    <h2>Kontrola importu</h2>
    <p>Po nahrání dat se v sekci "Logy importů" objeví jednotlivé importy, jeden pro každý nahraný soubor. Během chvíle by mělo dojít k jejich dokončení. Výsledek importu si pak lze prohlédnout přes tlačítko "Zobrazit logy", kde se dá zjistit, proč se daný import nepovedl. Import se provede buď celý najednou, nebo vůbec. Pokud tedy dojde během importu k chybě, aplikace se vrátí do původního stavu, tedy se např. nesmažou data, pokud byla při nahrávání zvolena možnost "Nahradit data".</p>
    <img src="@/assets/images/import-guide/import-queue.png">


</div>
</template>

<script>
export default {
    name: 'ImportGuidePage'
}
</script>

<style lang='scss'>
</style>