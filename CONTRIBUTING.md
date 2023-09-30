# Přispívání do kódu

## Doporučené workflow
1) Z issues tady na githubu si vybereš, které bys chtěl realizovat
2) V daném ticketu napíšeš že se jdeš ticketu věnovat
3) forkneš si repository, připravíš úpravy u sebe v repositáři
4) založíš pull request oproti cityvizor repo (do **staging** větve)
5) tvůj pull request musí splňovat formální požadavky (vždy aktivní github actions, které kontrolují kvalitu a funkčnost kódu), jinak nebude přijat
6) ke zpracování se vyjádří alespoň jeden člověk z core týmu a provede code-review

# Kde si říct o pomoc:
* diskuze zde v repozitáři https://github.com/cityvizor/cityvizor/discussions

## Spuštění pomocí Docker compose
Pro prvotní osahání je nejjednodušší použít Docker compose, který nastartuje všechny potřebné služby. Stačí spustit
`docker-compose up --build` a aplikace bude běžet na http://localhost:4200/. Tento způsob spuštění by měl simulovat produkci.

Soubor `docker-compose.yml` je i dobrý i pro představu jak se jednotivé služby konfigurují a startují. Dá se tam 
například najít, jak nastartovat Postgres v Dockeru tak aby v něm byla nějaká data. 

## Lokální vývoj

Příkaz

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

spustí celou aplikaci s hot reloadem klienta, landing page a JS serveru pro rychlý vývoj. Pokud spouštíte celý příkaz opakovaně, může se hodit před znovuspuštěním celý stack zresetovat přes `docker-compose down`. Při použití tohoto příkazu se také vytvoří defaultní administrátorský účet; login: `admin`, heslo: `admin`.

### Testovací data
Data do lokální databáze jsou nahrávána ze souboru `database/development_db_data.sql`, který lze vygenerovat z aktuálního stavu databáze příkazem `pg_dump -E UTF8  -U postgres  -f  database/development_db_data.sql  -h localhost cityvizor`. 

Pokud je to možné, je lepší se vzhnout editaci už aplikované migrace (i pokud byla aplikovanná pouze na lokální vývojovou databázi). Jakmile byl ze stavu databáze po aplikování první verze migrace vygenerován `database/development_db_data.sql` soubor, bude tento soubor po editaci migrace s migrací v konfliktu. V souboru zaprvé bude informace o tom, že daná migrace již byla aplikována a migrace tedz nebude aplikována znovu a změny v migraci se neprojeví (je třeba ze souboru smazat řádek o aplikaci příslušné migrace). Další problém je, že situace po aplikaci první verze migrace je zachycena v datech v `database/development_db_data.sql` souboru. 


## Testy
Projekt aktuálně nemá vytvořené testy, ale budeme rádi když s nimi pomůžeš.

## Coding Standards
Frontend dle [Angular Style Guide](https://angular.io/guide/styleguide).
Code Quality dle automaticky kontrolovaných ESLint pravidel (pre-commit hook a kontrola každého pull-request/push)

## Pravidla přispívání
- kód a commity **v angličtině**,
- všechno ostatní (pull requesty, issues, dokumentace) **v češtině**,

Všechny schválené pull requesty se začlenují do větve **staging** squashnutím (tedy všechny commity v PR se sloučí do jednoho commitu a ten se následně vloží do větve s jednou commit zprávou).

## Verzování

Verzování je tvořeno tříčíselným číslem verze: `<major>.<minor>.<patch>`

Toto číslo se mění následovně:
 - major číslo se zvýší a minor a patch čísla vynulují, pokud s verzí přichází breaking change
 - minor číslo se zvýší a patch číslo vynuluje, pokud s verzí přichází nová funkcionalita
 - patch číslo se zvýší, pokud s verzí přichází drobná oprava chyby

 Více o sémantickém verzování na [semver.org](https://semver.org/lang/cs/).
