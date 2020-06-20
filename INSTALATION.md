# Instalace

Pokud hledáte návod na lokální instalaci pro vývoj, postupujte podle [CONTRIBUTING.md](CONTRIBUTING.md)

## Potřebné aplikace

 - [NodeJS](https://nodejs.org) 10+
 - [PostgreSQL](https://www.postgresql.org/download/) 11+

## Instalace a kompilace

```sh
npm install     # instalace balíčků
npm run build   # kompilace kódu
```

## Nastavení

### Vytvoření admin přístupu

```
npm run create-admin
```

Vytvoří uživatele admin s heslem admin

### Prostředí

Konfigurační soubory `server/environment.<prostředí>.js`

Prostředí nastavíme pomocí globální proměnné `NODE_ENV`:

```sh
NODE_ENV=production        # Linux & Mac
$end:NODE_ENV="production" # Windows PowerShell
set NODE_ENV=production    # Windows Command Prompt
```

Přednastavené je pouze prostředí `local`.

### Konfigurační soubory

|                            | Složka              |
|----------------------------|---------------------|
| Frontend                   | `client/src/config` |
| Backend - obecná nastavení | `server/config`     |
| Backend - řízení přístupů  | `server/src/acl`    |


## Spuštění

```sh
npm start
```
