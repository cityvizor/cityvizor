# Přehled
Cityvizor se seskládá z následujících komponent:
- Landing page (./landing-page)
- Klient (./client)
- Server (./server)
- Worker (./server)
- DB (postgres)

## Landing page
Vue.js 2 aplikace; jedná se o stránku na https://cityvizor.cz/landing (https://cityvizor.cz na tuto stránku přesměrovává). Obsahuje odkazy na profily obcí, doprovodné texty k aplikaci, technickou dokumentaci a formuláře pro získávání zpětné vazby/zapojení obce.

Aplikace také umožňuje customizování textu na stránkách pomocí konfiguračních souborů. Tato funkcionalita se hodí v případě, že si nějaká obec sama hostuje Cityvizor a chce mít možnost úpravy textů, bez úprav samotných zdrojových kódů. Na toto je potřeba vytvořit konfigurační soubor (vzor v `./landing-page/cfg/content.json`) a následně tento soubor bind-mountnout do `/app/cfg` složky v kontejneru.

## Klient
Angular aplikace; jedná se o samotnou vizualizaci profilu obce (např. https://cityvizor.cz/praha1/prehled). Dále administrace profilů (https://cityvizor.cz/login), kde je možno spravovat jednotlivé profily a nahrávat do nich data.

Tyto dva frontendy spolu žijí na jedné adrese, ale nevědí o sobě. Toto je zařízené přes nginx a reverzní proxy (./nginx/production/nginx.conf), kde landing page obslujuje požadavky na `/landing` a klient obsluhuje ostatní požadavky. Landing page vznikla jako výsledek spolupráce s Česko.Digital. 

## Server
Node.js + Typescript, aplikace; poskytuje jednak API nad databází konzumované klientem; dále se stará o autentizaci a práva k administraci. 

## Worker
Součást serveru; nicméně se spouští jako samostatný proces (viz `./server/entrypoint.sh` a `./server/package.json`). Worker má na starosti pravidelnou aktualizaci dat, jako stahování posledních smluv či obsahu z eDesek a dále samotný import dat do aplikace. 

### Import dat
Průběh importu je popsán v [technické dokumentaci](https://cityvizor.cz/landing/dokumentace). Po nahrání dat do formuláře v administraci v klientovi server tyto data umístí do složky sdílené s workerem (pomocí bind-mountu) a zapíše záznam do tabulky v DB, kterou worker pravidelně kontroluje. Samotný import dat pak provede worker. 

## Databáze
Postgres. Do databáze v development módu je možné se dostat pomocí `docker exec -it db.cityvizor.otevrenamesta psql -U postgres -d cityvizor`, kde by měly být testovací data. 

### Migrace
Migrace probíhá pomocí Knex migračních skriptů, které se umisťují do `server/migrations` složky.

## Minio
S3-compatible úložiště; aktuálně se používá na ukládání avatarů obcí.

## Redis
Používáno serverem jako cache requestů na API, TTL 5 minut.

## Další způsoby deploymentu
V `./deployment/redesing-prod` jsou skripty a návody na deployment pomocí Kubernetes (microk8s). Skripty jsou lehce zastaralé.

## Demo
Angular standalone aplikace; není součástí docker-compose dev stacku a spouští se separátně. Jedná se o nástroj pomocí kterého si jednotlivé obce mohou vyzkoušet, jak by jejich nahraná data vypadala v Cityvizoru. Obsahuje lehce zastaralou vizualiaci a konverter účetních dat v formátu Ginis. Deprecated a funkcionality se budou postupně přesouvat do hlavní aplikace. 

# Deployment
Dvě větve -- master a staging. Vyvíjí se proti stagingu, do kterého jdou PR. Github Actions buildí a publishují Docker image na Docker Hub s tagem master/staging, tak aby image odpovídaly tomu, co je aktuálně ve větvi. Staging tagy se nasazují na Betu (beta.cityvizor.cz), Master tagy pak na produkci (cityvizor.cz). 

Po tom, co doběhne CI a publishne nové image je potřeba se sshčknout na příšlušný server a spustit update pomocí `cityvizor-update`. 

# Principy vizualizace dat
https://docs.google.com/presentation/d/1iy1SmJ0rSdKOE5QQmygTz0seZFAziToAqserWGZNboo/edit?usp=sharing

# Náčrty

## Deployment
https://docs.google.com/drawings/d/1zO5Y6J_z5uVkC-rKdUkBbWG6gnbacRPVap97ql-mztQ/edit?usp=sharing

## Architektura
https://docs.google.com/drawings/d/1DlfCOepVZ--4FZCidNpYQ7grSc5zrj-Inb7ul4tFngw/edit?usp=sharing

