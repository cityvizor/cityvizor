---
layout: default
title: Dokumentace
menu: dokumentace
---

* TOC
{:toc}

## Specifikace vstupních dat

### Formát

Textový soubor CSV (hodnoty oddělené středníkem, kódování UTF-8, escapovací znak ")

### Struktura

Z důvodů zpětné kompatibility i variablity vstupů mohou mít sloupce různé názvy (viz sloupec Alternativní názvy v následujících tabulkách). Zároveň také nezáleží na pořadí sloupců. Sloupce, které jsou označené jako nepovinné jsou nepovinné pro úspěšné vykonání importu, samozřejmě ale bude mít jejich nevyplnění, tam kde je to příslušné, negativní dopad na kvalitu vizualizace (čím méně toho vyplníte, tím méně toho uživatelé uvidí).

#### Datový soubor

<table class="table table-condensed table-hover table-striped">
  <thead>
    <tr><th>Pole</th><th>Alternativní názvy</th><th>Typ</th><th>Povinné?</th><th>Popis</th></tr>    
  </thead>
  <tbody>
    <tr><td>amountType</td><td>PRIJEM_VYDAJ</td><td>P/V</td><td>Ne</td><td>Označení zda se jedná o příjmový či výdajový záznam</td></tr>
    <tr><td>recordType</td><td>MODUL, DOKLAD_AGENDA</td><td>ROZ/KDF/KOF/prázdné/jiné</td><td>Ano</td><td>Typ záznamu. ROZ = upravený rozpočet, KDF = došlá faktura, KOF = odešlá faktura, prázdné/jiné = ostatní záznamy</td></tr>
    <tr><td>paragraph</td><td>PARAGRAF</td><td>číslo</td><td>Ano</td><td>Rozpočtový paragraf</td></tr>
    <tr><td>item</td><td>POLOZKA</td><td>číslo</td><td>Ano</td><td>Rozpočtová položka</td></tr>
    <tr><td>event</td><td>AKCE, ORG</td><td>číslo</td><td>Ne</td><td>Číslo akce dle číselníku</td></tr>
    <tr><td>amount</td><td>CASTKA</td><td>částka</td><td>Ano</td><td>Částka v Kč</td></tr>
    <tr><td>date</td><td>DATUM, DOKLAD_DATUM</td><td>datum ve formátu YYYY-MM-DD</td><td>Ne</td><td>Datum, pouze u faktur</td></tr>
    <tr><td>counterpartyId</td><td>SUBJEKT_IC</td><td>text</td><td>Ne</td><td>IČO protistrany, pouze u faktur</td></tr>
    <tr><td>counterpartyName</td><td>SUBJEKT_NAZEV</td><td>text</td><td>Ne</td><td>Jméno protistrany, pouze u faktur</td></tr>
    <tr><td>description</td><td>POZNAMKA</td><td>text</td><td>Ne</td><td>Popis faktury, pouze u faktur</td></tr>
  </tbody>
</table>
        
#### Číselník akcí

<table class="table table-condensed table-hover table-striped">
  <thead>
    <tr><th>Pole</th><th>Alternativní názvy</th><th>Typ</th><th>Povinné?</th><th>Popis</th></tr>    
  </thead>
  <tbody>
  <tr><td>srcId</td><td>AKCE, ORG, ORJ</td><td>text</td><td>Ano</td><td>Číslo akce</td></tr>
    <tr><td>name</td><td>AKCE_NAZEV, ORG_NAZEV, ORJ_NAZEV</td><td>text</td><td>Ano</td><td>Název akce</td></tr>
    <tr><td>description</td><td>POPIS</td><td>text</td><td>Ne</td><td>Popis akce, co a proč bylo nakupováno atd.</td></tr>
  </tbody>
</table>

## Zpracování dat aplikací

CityVizor si neklade za cíl data nijak upravovat kromě zpracování za cílem vizualizace. Z date tedy nebudou odstraněny osobní údaje v popisech faktur, nebudou skryty vnitřní přesuny ani nebude nijak zasahováno do způsobu vedení rozpočtu obce. některé změny jsou ale v rámci zpracování nutné a jejich soupis najdete níže.

### Sečtení duplikovaných záznamů
Pokud budou ve zdroji dva či více stejných záznamů, tj. takových, které mají stejnou položku, paragraf i akci, budou částky u těchto záznamů do vizualizace sečteny a brány jako jeden záznam. Toto neplatí pro vizualizaci faktur, které budou zobrazeny tak, jak byly ve zdrojových datech.

### Vynechání nulových záznamů
Záznamy, jejichž částka se rovná nule, nebudou ve vizualizaci zobrazeny.

### Dělení faktur
Faktury, které jsou rozdělené do více rozpočtových položek, akcí či paragrafů budou ve zobrazení tolikrát, v kolika těchto kombinacích budou zařazeny, tj. tak, jak jsou ve vstupních datech. Do budoucna uvažujeme o slučování těchto faktur do jedné, což by ale zvýšilo náročnost importu a vyžadovalo pole čísla faktury.


