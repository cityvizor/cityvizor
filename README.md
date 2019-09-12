# CityVizor

Přehledný rozklikávací rozpočet s plněním na jednotlivé faktury a dalšími funkcemi pro samosprávy. Aplikace byla vytvořena zaměstnanci [Ministerstva financí ČR](http://www.mfcr.cz), [Otevřená Města](http://www.otevrenamesta.cz/) vám poskytují tuto aplikaci jako službu. Data jsou poskytována obcemi dobrovolně.

## Spuštění na serveru

### Instalace

#### Potřebné aplikace

 - [NodeJS](https://nodejs.org) 10+
 - [PostgreSQL](https://www.postgresql.org/download/) 11+

#### Instalace a kompilace

```sh
npm install     # instalace balíčků
npm run build   # kompilace kódu
```

### Nastavení

#### Vytvoření admin přístupu

```
npm run create-admin
```

Vytvoří uživatele admin s heslem admin

#### Konfigurace

##### Prostředí

Konfigurační soubory `server/environment.<prostředí>.js`

Prostředí nastavíme pomocí globální proměnné `NODE_ENV`:

```sh
NODE_ENV=production        # Linux & Mac
$end:NODE_ENV="production" # Windows PowerShell
set NODE_ENV=production    # Windows Command Prompt
```

Přednastavené je pouze prostředí `local`.

##### Obecná nastavení

Složka `server/config`.

##### Řízení přístupů

Složka `server/src/acl`.

#### Konfigurace klienta

Složka `client/src/config`

### Spuštění

```sh
npm start
```

## Lokální vývoj

### Pouze frontend (bez lokálního serveru, použije se dev.cityvizor.cz)
```sh
cd client
ng serve --configuration=local
```

### Frontend i backend

Frontend:
```sh
cd client
ng serve --configuration=local-server
```

Backend:
```sh
$env:NODE_ENV="local" # ve Windows v PowerShellu
set NODE_ENV=local    # ve Windows v příkazovém řádku
NODE_ENV=local        # v Linuxu nebo na Macu v terminálu

cd server
npm run dev
```
### Pravidla přispívání

- kód **v angličtině**, commity **v angličtině**, pull requesty **v angličtině**, issues **v češtině**
- struktura souborů na klientu dle [Angular Style Guide](https://angular.io/guide/styleguide)
