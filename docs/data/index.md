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
- data můžou být až s hodinovým zpožděním
- formát dat lze zvolit hlavičkou Accept, dostupné jsou formáty application/json a text/csv 

### Profily obcí

```GET /api/exports/profiles```

### Dostupné roky

```GET /api/exports/profiles/:profile_id/years```

### Účetnictví

```GET /api/exports/profiles/:profile_id/accounting/:year```

### Doklady

```GET /api/exports/profiles/:profile_id/payments/:year```

### Akce

```GET /api/exports/profiles/:profile_id/events/:year```