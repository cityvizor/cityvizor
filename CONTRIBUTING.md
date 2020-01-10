# Přispívání do kódu

## Lokální vývoj

Frontend:
```sh
cd client
ng serve --configuration=local
```

Backend:

```sh
$env:NODE_ENV="local" # ve Windows v PowerShellu
set NODE_ENV=local    # ve Windows v příkazovém řádku
NODE_ENV=local        # v Linuxu nebo na Macu v terminálu

cd server
npm run dev
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