# Import účetních dat a předpočítané souhrny

Tento dokument popisuje interní tok importu na serveru, přepočet účetních
souhrnů a jednorázový backfill. Uživatelské formáty a způsob nahrání dat jsou
popsané v [technické dokumentaci Cityvizoru](https://cityvizor.cz/landing/dokumentace).

## Průběh importu

1. Importní API uloží vstupní soubory do úložiště sdíleného se serverovým
   workerem a vytvoří záznam v `app.imports` se stavem `pending`.
2. Worker každých deset sekund vybere nejstarší čekající import a označí ho
   jako `processing`.
3. Příslušný importer zpracuje soubory a zapíše zdrojová data například do
   `data.accounting`, `data.payments` a `data.events`.
4. Pokud se změnilo účetnictví municipality, worker zavolá
   `rebuildAccountingSummaries()` pro importovaný profil a rok.
5. Zdrojová účetní data a souhrny se zapisují ve stejné databázové transakci.
   Chyba importu nebo přepočtu proto způsobí rollback obou částí.
6. Worker uloží výsledek importu jako `success` nebo `error`.

Stav importního jobu a jeho logy se ukládají mimo datovou transakci. Násilně
ukončený worker proto může zanechat job ve stavu `processing`, i když PostgreSQL
jeho nedokončenou datovou transakci vrátil zpět.

## Kdy se souhrny přepočítávají

- Cityvizor import vrátí změnu účetnictví pro `data.csv`, `accounting.csv` a
  `payments.csv`; čistý import `events.csv` souhrny nepřepočítá.
- InternetStream přepočítá souhrny po každém úspěšném importu.
- GINIS KXX přepočítá souhrny po zpracování obou souborů, účetnictví i rozpočtu.
- PBO importy účetní souhrny municipality nevytvářejí.
- POST replacement i PATCH append vždy znovu sestaví celý dotčený profil a rok.

Přepočet nejprve smaže staré souhrny daného profilu a roku a následně je znovu
vytvoří z `data.accounting`. Neprovádí inkrementální přičítání.

## Souhrnné tabulky

- `data.accounting_year_summaries` obsahuje celkové příjmy, výdaje a financování
  v rozpočtu i skutečnosti za jeden profil a rok.
- `data.accounting_group_summaries` obsahuje stejné částky podle dvouciferné
  skupiny paragrafu nebo položky.

Výpočet částek je v
[`accounting-summaries.ts`](accounting-summaries.ts) a databázové schéma v
[`20261004110000_accounting_summaries.js`](../../../migrations/20261004110000_accounting_summaries.js).

Feature flag `precomputed-accounting-summaries` ovládá pouze zdroj čtení
veřejného API. Souhrny se při importu aktualizují i při vypnutém flagu. Frontend
flag nevyhodnocuje a tvar odpovědí API se nemění.

## Ruční backfill

Backfill vyžaduje sestavený server a stejné databázové nastavení jako backend.
Z kořene repozitáře lze přepočítat všechny roky municipality profilů včetně
skrytých:

```bash
npm --prefix server run rebuild-accounting-summaries -- --all
```

Přepočet lze omezit na profil, rok nebo jejich kombinaci:

```bash
npm --prefix server run rebuild-accounting-summaries -- --profile 45
npm --prefix server run rebuild-accounting-summaries -- --year 2026
npm --prefix server run rebuild-accounting-summaries -- --profile 45 --year 2026
```

Uvnitř serverového kontejneru se prefix `server` nepoužívá:

```bash
npm run rebuild-accounting-summaries -- --all
```

Každý profil a rok běží v samostatné transakci. Příkaz lze po chybě bezpečně
spustit znovu; již dokončené dvojice zůstanou uložené. Bez parametrů nebo s
`--help` pouze vypíše nápovědu a nepřipojí se k databázi.

## Doporučené nasazení

1. Nasadit databázové migrace a nový worker. Flag zůstává vypnutý.
2. Nechat doběhnout aktivní import a pozastavit worker.
3. Spustit úplný backfill.
4. Porovnat souhrny se zdrojovými daty a odpovědi API s původním čtením.
5. Obnovit worker a ověřit jeden následný import.
6. Zapnout nové čtení pomocí feature flagu.

Stav flagu a jeho zapnutí:

```sql
SELECT name, enabled
FROM app.feature_flags
WHERE name = 'precomputed-accounting-summaries';

UPDATE app.feature_flags
SET enabled = true
WHERE name = 'precomputed-accounting-summaries';
```

Pokud je potřeba rychlý návrat k původním dotazům, stačí flag vypnout. Souhrnné
tabulky se tím nemažou a jejich zápis při dalších importech pokračuje:

```sql
UPDATE app.feature_flags
SET enabled = false
WHERE name = 'precomputed-accounting-summaries';
```

Změna flagu nevyžaduje restart backendu.

## Ověření

Před zapnutím flagu ověřte alespoň:

- roční souhrn pro každý municipality profil a rok, včetně prázdných roků;
- počet a částky paragrafových i položkových skupin;
- shodu všech šesti částek se zdrojovým `data.accounting`;
- úspěšný import a přepočet jednoho profilu a roku;
- shodu odpovědí těchto endpointů před a po přepnutí:
  - `/api/public/profiles/:profile/years?sumMode=complete`,
  - `/api/public/profiles/:profile/years?sumMode=visible`,
  - `/api/public/profiles/:profile/dashboard`,
  - `/api/public/profiles/:profile/accounting/:year/groups/paragraph`,
  - `/api/public/profiles/:profile/accounting/:year/groups/item`.

Anonymní `/api/public` odpovědi jsou v Redis cache. Při porovnání před a po
přepnutí použijte nový cache klíč, například neznámý query parametr
`_summary_check=<čas>`, nebo cache jinak prokazatelně obejděte. Pole výsledků
před porovnáním seřaďte; pořadí řádků bez výslovného SQL `ORDER BY` není součástí
API kontraktu.

Relevantní automatický test přepočítávacího helperu je v
[`accounting-summaries.test.ts`](../../../test/accounting-summaries.test.ts).
Implementace CLI je v
[`rebuild-accounting-summaries.ts`](../../scripts/rebuild-accounting-summaries.ts).
