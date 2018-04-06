# CityVizor

[![dependencies](https://david-dm.org/otevrena-data-mfcr/CityVizor.svg)](https://david-dm.org/otevrena-data-mfcr/CityVizor)

Přehledný rozklikávací rozpočet s plněním na jednotlivé faktury a dalšími funkcemi pro samosprávy. Aplikace byla vytvořena zaměstnanci [Ministerstva financí ČR](http://www.mfcr.cz), [Otevřená Města](http://www.otevrenamesta.cz/) vám poskytují tuto aplikaci jako služba. Data jsou poskytována obcemi dobrovolně.

Toto je front end aplikace. Serverovou část najdete v repozitáři [CityVizor Server](https://github.com/otevrena-data-mfcr/CityVizor-server).

## Instalace

Instalace závislostí

```
npm install
```

Kompilace kódu

```
npm run build
```

## Nastavení

Nastavit CityVizor je možné v souboru confi.js:
- ```/src/config/config.js```

## Přispívání

 - Uvítáme jak PR, tak Issues
 - Konvence pro pojmenovávání souborů komponent je <název komponenty>.<component|style|template>.<formát>, nikoliv <název komponenty>.component.<formát>, jak je běžné v Angular CLI. Přijde nám nelogické odlišovat typ souboru formátem.
 - Neobsahové popisky vždy v angličtině (názvy proměnných, metod apod.)
 - Commity vždy v angličtině
