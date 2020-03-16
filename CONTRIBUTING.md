# Přispívání do kódu

## Doporučené workflow
1) z issues tady na githubu si vybereš, které bys chtěl realizovat
3) napíšeš na Slack kanál [#p-citivizor](https://cesko-digital.slack.com/archives/CG66HNLH4), že máš chuť udělat issue XY a ideálně k němu přidáš i komentář na githubu, aby to bylo všem ostatním jasné a nepracovalo nás na na tom zbytečně více najednou
3) forkneš si repository, připravíš úpravy u sebe v repositáři
4) založíš pull request oproti cityvizor repo (do master větve)

# Kde si říct o pomoc:
* slack kanál [#p-citivizor](https://cesko-digital.slack.com/archives/CG66HNLH4)

## Lokální vývoj

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

### Server v kotlinu

#### Prerekvizity
- JDK

#### Kompilace a testy
```sh
cd server-kotlin
./gradlew clean test
```

## Testy
Projekt aktuálně nemá vytvořené testy, ale budeme rádi když s nimi pomůžeš.

## Coding Standards
Frontend dle [Angular Style Guide](https://angular.io/guide/styleguide).

## Pravidla přispívání
- kód **v angličtině**,
- commity **v angličtině**,
- pull requesty **v angličtině**,
- issues **v češtině**
- dokumentace a dlouhé texty **v češtině**

Jde o dobrovolnický projekt a tedy věříme, že na code review můžete i chvíli počkat i když se vynasnažíme to udělat co nejdříve.

Všechny schválené pull requesty se začlenují do větve `master` squashnutím (tedy všechny commity v PR se sloučí do jednoho commitu a ten se následně vloží do větvě s jednou commit zprávou).

## Verzování

Verzování je tvořeno tříčíselným číslem verze: `<major>.<minor>.<patch>`

Toto číslo se mění následovně:
 - major číslo se zvýší a minor a patch čísla vynulují, pokud s verzí přichází breaking change
 - minor číslo se zvýší a patch číslo vynuluje, pokud s verzí přichází nová funkcionalita
 - patch číslo se zvýší, pokud s verzí přichází drobná oprava chyby

 Více o sémantickém verzování na [semver.org](https://semver.org/lang/cs/).
