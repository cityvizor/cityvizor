---
layout: default
title: Data
menu: data
---

* TOC
{:toc}

## REST API

CityVizor nabízí jednoduché API pro stahování exportů dat. Toto API bude postupně vylepšováno dle požadavků uživatelů dat.

Vlastnosti dat:
- v současnosti neexistuje limit na stažení dat, v případě zneužívání exportů bude zaveden
- data jsou s maximálně hodinovým zpožděním
- data jsou exportována ve formát JSON

Všechny žádosti jsou na hostname ```cityvizor.cz```.

### Profily obcí

```GET /exports/profiles```

### Profil obce

```GET /exports/profiles/:profile```

### Datové sady profilu obce

```GET /exports/profiles/:profile/etls```

### Rozpočty obce

```GET /exports/profiles/:profile/budgets```

### Rozpočet obce za rok

```GET /exports/profiles/:profile/budgets/:year```

### Faktury obce za rok

```GET /exports/profiles/:profile/payments/:year```
