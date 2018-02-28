---
layout: default
title: Data
menu: data
---

* TOC
{:toc}

## API

CityVizor nabízí jednoduché API pro stahování exportů dat. Toto api bude postupně upravováno dle požadavků uživatelů dat.

Vlastnosti dat:
- v současnosti neexistuje limit na stažení dat, v případě zneužívání exportů bude zaveden
- data jsou s až desetiminutovým zpožděním, z důvodu kešování
- data jsou exportována ve formát JSON

### Profily obcí: ```GET /exports/profiles```

### Profil obce: ```GET /exports/profiles/:profile```

### Datové sady profilu obce: ```GET /exports/profiles/:profile/etls```

### Rozpočty obce: ```GET /exports/profiles/:profile/budgets```

### Rozpočet obce za rok: ```GET /exports/profiles/:profile/budgets/:year```

### Faktury obce za rok: ```GET /exports/profiles/:profile/payments/:year```
