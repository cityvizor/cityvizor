# Přispívání do kódu

## Doporučené workflow
1) z issues tady na githubu si vybereš, které bys chtěl realizovat
2) V daném ticketu napíšeš že se jdeš ticketu věnovat
3) forkneš si repository, připravíš úpravy u sebe v repositáři
4) založíš pull request oproti cityvizor repo (do **staging** větve)
5) tvůj pull request musí splňovat formální požadavky (vždy aktivní github actions, které kontrolují kvalitu a funkčnost kódu), jinak nebude přijat
6) ke zpracování se vyjádří alespoň jeden člověk z core týmu a provede code-review

# Kde si říct o pomoc:
* diskuze zde v repozitáři https://github.com/cityvizor/cityvizor/discussions
* slack kanál Česko Digital [#p-citivizor](https://cesko-digital.slack.com/archives/CG66HNLH4)

## Spuštění pomocí Docker compose
Pro prvotní osahání je nejjednodušší použít Docker compose, který nastartuje všechny potřebné služby. Stačí spustit
`docker-compose up --build` a chvíli počkat. 

Po nastartování budou k dispozici následující služby
- UI na http://localhost:4200
- landing page UI na http://localhost:4202

Soubor `docker-compose.yml` je i dobrý i pro představu jak se jednotivé služby konfigurují a startují. Dá se tam 
například najít, jak nastartovat Postgres v Dockeru tak aby v něm byla nějaká data. 

## Lokální vývoj

Příkaz `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build` spustí celou aplikaci s hot reloadem klienta, landing page a JS serveru pro rychlý vývoj. Pokud spouštíte celý příkaz opakovaně, může se hodit před znovuspuštěním celý stack zresetovat přes `docker-compose down`. Při použití tohoto příkazu se také vytvoří defaultní administrátorský účet; login: `admin`, heslo: `admin`.

### Klient

#### Prerekvizity
- [NodeJS](https://nodejs.org/en/)
- [Angular CLI](https://cli.angular.io/) (npm install -g @angular/cli)

#### Spuštění
```sh
cd client
ng serve --configuration="local"
```
- Vývojový server běží na http://localhost:4200/
- Automatická rekompilace kódu
- Live reload

### Server v Node.js

#### Prerekvizity
- [NodeJS](https://nodejs.org/en/)

#### Spuštění
Spuštění a reload:
```sh
cd server
nodemon dist/index.js
```
- Server běží na http://localhost:3000
- Možnost spustit zvlášť pouze server (```nodemon dist/server.js```) nebo pouze worker (```nodemon dist/worker.js```)
Automatická rekompilace:
```sh
cd server
npx tsc -w
```

## Testy
Projekt aktuálně nemá vytvořené testy, ale budeme rádi když s nimi pomůžeš.

## Coding Standards
Frontend dle [Angular Style Guide](https://angular.io/guide/styleguide).
Code Quality dle [Google/GTS](https://github.com/google/gts), a automaticky kontrolovaných ESLint / TSLint pravidel (pre-commit hook a kontrola každého pull-request/push)

## Pravidla přispívání
- kód a commity **v angličtině**,
- všechno ostatní (pull requesty, issues, dokumentace) **v češtině**,

Všechny schválené pull requesty se začlenují do větve **staging** squashnutím (tedy všechny commity v PR se sloučí do jednoho commitu a ten se následně vloží do větvě s jednou commit zprávou).

## Verzování

Verzování je tvořeno tříčíselným číslem verze: `<major>.<minor>.<patch>`

Toto číslo se mění následovně:
 - major číslo se zvýší a minor a patch čísla vynulují, pokud s verzí přichází breaking change
 - minor číslo se zvýší a patch číslo vynuluje, pokud s verzí přichází nová funkcionalita
 - patch číslo se zvýší, pokud s verzí přichází drobná oprava chyby

 Více o sémantickém verzování na [semver.org](https://semver.org/lang/cs/).
