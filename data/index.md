---
layout: default
title: Data
menu: data
---

* TOC
{:toc}

## Profily zveřejňujících obcí

### Popis

Data jsou aktualizována jednou denně hodinu po půlnoci.

### Struktura

TBD

### Formát

Textový soubor CSV (hodnoty oddělené středníkem, kódování UTF-8, escapovací znak ")

### Data ke stažení
- [Profily obcí](https://cityvizor.cz/data/exports/profiles.csv)

## Obecní rozpočty

### Popis

Data jsou aktualizována jednou denně hodinu po půlnoci.

### Struktura

#### Datový soubor
<table class="table table-condensed table-hover table-striped">
  <thead>
    <tr><th>Pole</th><th>Alternativní názvy</th><th>Typ</th><th>Povinné?</th><th>Popis</th></tr>    
  </thead>
  <tbody>
    <tr><td>amountType</td><td>PRIJEM_VYDAJ</td><td>P/V</td><td>Ne</td><td>Označení zda se jedná o příjmový či výdajový záznam</td></tr>
    <tr><td>recordType</td><td>MODUL, DOKLAD_AGENDA</td><td>ROZ/KDF/KOF/prázdné/jiné</td><td>Ano</td><td>Typ záznamu. ROZ = rozpočet, KDF = došlá faktura, KOF = odešlá faktura, prázdné/jiné = ostatní záznamy</td></tr>
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
    <tr><td>description</td><td>POPIS</td><td>text</td><td>Ne</td><td>Popis akce, co a proč byla nakupováno atd.</td></tr>
  </tbody>
</table>

### Formát

Textový soubor CSV (hodnoty oddělené středníkem, kódování UTF-8, escapovací znak ")

### Data ke stažení

***2016***
- [Číselník akcí](https://cityvizor.cz/data/exports/budgets-2016.events.csv)
- [Datový soubor](https://cityvizor.cz/data/exports/budgets-2016.data.csv)
- [Faktury](https://cityvizor.cz/data/exports/budgets-2016.payments.csv)

***2017***
- [Číselník akcí](https://cityvizor.cz/data/exports/budgets-2017.events.csv)
- [Datový soubor](https://cityvizor.cz/data/exports/budgets-2017.data.csv)
- [Faktury](https://cityvizor.cz/data/exports/budgets-2017.payments.csv)
