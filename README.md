# CityVizor

[![dependencies](https://david-dm.org/otevrena-data-mfcr/CityVizor.svg)](https://david-dm.org/otevrena-data-mfcr/CityVizor)

Přehledný rozklikávací rozpočet s plněním na jednotlivé faktury a dalšími funkcemi pro samosprávy. Aplikace byla vytvořena zaměstnanci [Ministerstva financí ČR](http://www.mfcr.cz), [Otevřená Města](http://www.otevrenamesta.cz/) vám poskytují tuto aplikaci jako služba. Data jsou poskytována obcemi dobrovolně.

## Instalace

### 1) Potřebné balíčky pro instalaci a běh

- MongoDB
- NodeJS

### 2) Instalace

Instalace závislostí

```
npm install
```

Kompilace kódu

```
npm run build
```

### 3) Nastavení

Nastavit CityVizor je nutné v následujících konfiguračních souborech:

- ```/server/config/config.production.js``` - nastavení serveru v produkčním módu, vzor v config.production.example.js
- ```/server/config/config.development.js``` - nastavení serveru ve vývojovém módu, vzor v config.development.example.js
- ```/src/config/config.js``` - nastavení GUI

Další možná nastavení:

- ```/server/config/import-config.js``` - nastavení pravidel importu dat z CSV
- ```/server/config/mongo-express-config.js``` - nastavení mongo-express
- ```/pm2-config.json``` - nastavení pro PM2

## Výchozí data

Administrátorský účet lze vytvořit spuštěním skriptu create-admin.js:
```
NODE_ENV=development node server/scripts/create-admin.js
NODE_ENV=production node server/scripts/create-admin.js
```

Vzorové číselníky rozpočtových paragrafů a položek lze do databáze vložit skriptem sample-codelists
```
NODE_ENV=development node server/scripts/sample-codelists.js
NODE_ENV=production node server/scripts/create-admin.js
```

## Spuštění

**Spuštění serveru**

```
npm start
```

**Spuštění cron scriptu automatických exportů a načítání smluv**

```
npm run cron
```

**Spuštění serverového clusteru dle počtu CPU a cron scriptu pomocí PM2**

```
npm install pm2 -g

pm2 start pm2-config.json --env production
```

## Spuštění pro vývoj

- Server se zrestartuje a kód překompiluje při jakékoliv změně.
- Na adrese /db běží ```mongo-express```

```
npm run dev
```
