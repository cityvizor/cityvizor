---
layout: default
title: Data
menu: data
---

* TOC
{:toc}

## Profily zveřejňujících obcí

### Formát

Textový soubor CSV (hodnoty oddělené středníkem, kódování UTF-8, escapovací znak ")

### Data ke stažení
- [Profily obcí](https://cityvizor.cz/data/exports/profiles.csv)

## Obecní rozpočty

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

### Vzorový soubor

Soubor s daty:

<table class="table table-condensed table-hover table-striped">
  <tr>
    <th>DOKLAD_AGENDA</th>
    <th>ORG</th>
    <th>PARAGRAF</th>
    <th>POLOZKA</th>
    <th>CASTKA</th>
    <th>DATUM</th>
    <th>SUBJEKT_IC</th>
    <th>SUBJEKT_NAZEV</th>
    <th>POZNAMKA</th>
  </tr>
  <tr>
    <td>ROZ</td>
    <td></td>
    <td>0</td>
    <td>1111</td>
    <td>120000</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>ROZ</td>
    <td>1</td>
    <td>5512</td>
    <td>5169</td>
    <td>66000</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>ROZ</td>
    <td>2</td>
    <td>2212</td>
    <td>5139</td>
    <td>85000</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>KDF</td>
    <td>2</td>
    <td>2212</td>
    <td>5139</td>
    <td>20000</td>
    <td>2017-01-05</td>
    <td>12345678</td>
    <td>Jiří Novák</td>
    <td>Uhrada za smluvené služby</td>
  </tr>
  <tr>
    <td>KDF</td>
    <td>2</td>
    <td>2212</td>
    <td>5139</td>
    <td>40000</td>
    <td>2017-02-01</td>
    <td>22345678</td>
    <td>Doprava a.s.</td>
    <td>Uhrada za leden</td>
  </tr>
  <tr>
    <td>KDF</td>
    <td>2</td>
    <td>2212</td>
    <td>5139</td>
    <td>20000</td>
    <td>2017-03-01</td>
    <td>22345678</td>
    <td>Doprava a.s.</td>
    <td>Uhrada za unor</td>
  </tr>
  <tr>
    <td></td>
    <td>1</td>
    <td>5512</td>
    <td>5169</td>
    <td>50000</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td>0</td>
    <td>1111</td>
    <td>95000</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>POK</td>
    <td>3</td>
    <td>0</td>
    <td>1340</td>
    <td>520</td>
    <td>2017-01-08</td>
    <td></td>
    <td></td>
    <td>Platební poukazka (pozn.: tento popis se v cityvizoru neukáže</td>
  </tr>
  <tr>
    <td></td>
    <td>126</td>
    <td>3612</td>
    <td>2132</td>
    <td>25000</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>KOF</td>
    <td>126</td>
    <td>3612</td>
    <td>2132</td>
    <td>30000</td>
    <td>2017-09-29</td>
    <td>32345678</td>
    <td>ABC Group</td>
    <td> a.s.</td>
  </tr>
  <tr>
    <td>KDF</td>
    <td>126</td>
    <td>3612</td>
    <td>5152</td>
    <td>11000</td>
    <td>2017-01-11</td>
    <td>42345678</td>
    <td>RWE</td>
    <td>Byty - dodávka tep. energie </td>
  </tr>
  <tr>
    <td>ROZ</td>
    <td>126</td>
    <td>3612</td>
    <td>5152</td>
    <td>60000</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
  <tr>
    <td>ROZ</td>
    <td>126</td>
    <td>3612</td>
    <td>2132</td>
    <td>70000</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</table>

Číselník akcí:

<table class="table table-condensed table-hover table-striped">
  <tr>
    <th>ORG</th>
    <th>ORG_NAZEV</th>
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
