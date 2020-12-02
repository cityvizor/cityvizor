## Specifikace vstupních dat

### Formát

Textový soubor CSV (hodnoty oddělené středníkem, kódování UTF-8, escapovací znak ")

### Struktura

Z důvodů zpětné kompatibility i variablity vstupů mohou mít sloupce různé názvy (viz sloupec Alternativní názvy v následujících tabulkách). Zároveň také nezáleží na pořadí sloupců. Sloupce, které jsou označené jako nepovinné jsou nepovinné pro úspěšné vykonání importu, samozřejmě ale bude mít jejich nevyplnění, tam kde je to příslušné, negativní dopad na kvalitu vizualizace (čím méně toho vyplníte, tím méně toho uživatelé uvidí). Pole *date*, *counterpartyId*, *counterpartyName* a *description* aplikace zpracovává pouze v případě, že se jedná o faktury (tedy pokud *type* = KDF nebo KOF).

Data můžete nahrát pro každý typ zvlášť (rozpočet, faktury, akce). Můžete také využít tzv. datový soubor, který obsahuje rozpočet a faktury dohromady.

### Průběh importu
Pokud se v průběhu importu ze souboru vyskytne chyba, pak se nic neuloží. Data se uloží jen tehdy, pokud import proběhne zcela v pořádku. Ve správě profilu si v záložce "Logy importů" můžete ověřit, jestli se daný import povedl a pokud ne, jaká chyba v zdrojovém souboru je. Pokud v importu nahrajete více souborů najednou, každý soubor se importuje zvlášť - pokud tedy nahrajete najednou nevalidní soubor s fakturami a validní soubor s účetnictvím, faktury se neimportují, ale účetnictví ano. Výjimku tvoří nahrávání přes .ZIP soubor, kde se se všechny zabalené soubory nahrají najednou.

#### Datový soubor

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
        
#### Číselník akcí

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

### Vzorová data
Zde uvádíme několik účetních záznamů v požadované struktuře. Pokud Vás zajímá, jak tato vzorová data CityVizor vizualizuje, zkopírujte je a nahrajte v požadovaném formátu do cityvizor.cz/demo. Zde si také můžete vyzkoušet, jak by vypadala aplikace s daty Vaší obce, aniž byste odesílali data na náš server.

**Vzorový datový soubor**

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

**Vzorový číselník akcí**

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

## Zpracování dat aplikací

CityVizor si neklade za cíl data nijak upravovat kromě zpracování za cílem vizualizace. Z dat tedy nebudou odstraněny osobní údaje v popisech faktur, nebudou skryty vnitřní přesuny ani nebude nijak zasahováno do způsobu vedení rozpočtu obce. Některé změny jsou ale v rámci zpracování nutné a jejich soupis najdete níže.

### Sečtení duplikovaných záznamů
Pokud je ve zdrojových datech dva či více takových záznamů, které mají stejnou položku, paragraf i akci, budou částky u těchto záznamů sečteny a brány jako jeden záznam. Díky tomuto není zpravidla problém s účetními záznamy se zápornou částkou (vratky, opravy apod.), protože jsou sečteny s příslušnými kladnými záznamy. Toto neplatí pro vizualizaci faktur, které budou zobrazeny tak, jak byly ve zdrojových datech.

### Vynechání nulových záznamů
Záznamy, jejichž částka se rovná nule, nebudou ve vizualizaci zobrazeny.

### Dělení faktur
Faktury, které jsou rozdělené do více rozpočtových položek, akcí či paragrafů budou vyzobrazeny tolikrát, v kolika těchto kombinacích budou zařazeny, tj. tak, jak jsou ve vstupních datech. Do budoucna uvažujeme o slučování těchto faktur do jedné, což by ale zvýšilo náročnost importu a vyžadovalo pole čísla faktury.

