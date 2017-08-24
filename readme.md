# CityVizor

![dependencies](https://david-dm.org/otevrena-data-mfcr/CityVizor.svg)

Přehledný rozklikávací rozpočet s plněním na jednotlivé faktury a dalšími funkcemi pro samosprávy. Aplikace byla vytvořena zaměstnanci [Ministerstva financí ČR](http://www.mfcr.cz), [Otevřená Města](http://www.otevrenamesta.cz/) vám poskytují tuto aplikaci jako služba. Data jsou poskytována obcemi dobrovolně.

## Instalace

**Potřebné balíčky pro instalaci a běh**

- MongoDB
- NodeJS

**Instalace**

Instalace závislostí

```
npm install
```

Kompilace kódu

```
npm run build
```

## Nastavení

Nastavit CityVizor je možno v následujících konfiguračních souborech:

- ```/server/config/config.production.js``` - nastavení serveru v produkčním módu
- ```/server/config/config.development.js``` - nastavení serveru ve vývojovém módu
- ```/server/config/import-config.js``` - nastavení pravidel importu dat z CSV
- ```/server/config/mongo-express-config.js``` - nastavení mongo-express
- ```/src/config/app-config.js``` - nastavení GUI
- ```/src/config/info-texts.js``` - informativní texty
- ```/pm2-config.json``` - nastavení pro PM2

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

## Vývojový mód

- Server se zrestartuje a kód překompiluje při jakékoliv změně.
- Na adrese /db běží ```mongo-express```

```
npm run dev
```
