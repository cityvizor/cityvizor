# Přispívání do kódu

* Typické workflow je takové, že projdeš issues tady na githubu, forkneš si repository, připravíš úpravy a pak založíš pull request oproti cityvizor repo (do master větve). Abychom se nepotkali na jedné issue, tak prosím do issue hoď komentář, že na ní začínáš pracovat.
* Primárním/nejrychlejším komunikačním kanálem je slack - zaregistrujte se na [https://slack.cesko.digital/](https://slack.cesko.digital/).

# Kde si říct o pomoc:
* slack kanál [#p-citivizor](slack://channel?id=p-citivizor&team=cesko-digital)
* direct message na Martin Wenisch

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

### Server v node.js

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

Jde o dobrovolnický projekt a tedy věříme, že na code review můžete i chvíli počkat i když se vynasnažíme to udělat co nejdříve.

Všechny schválené pull requesty se začlenují do větve `master` squashnutím (tedy všechny commity v PR se sloučí do jednoho commitu a ten se následně vloží do větvě s jednou commit zprávou).

## Verzování

Verzování je tvořeno tříčíselným číslem verze: `<major>.<minor>.<patch>`

Toto číslo se mění následovně:
 - major číslo se zvýší a minor a patch čísla vynulují, pokud s verzí přichází breaking change
 - minor číslo se zvýší a patch číslo vynuluje, pokud s verzí přichází nová funkcionalita
 - patch číslo se zvýší, pokud s verzí přichází drobná oprava chyby

 Více o sémantickém verzování na [semver.org](https://semver.org/lang/cs/).
