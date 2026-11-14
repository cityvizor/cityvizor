# Landing page

## Instalace

Použij Node.js 26, stejně jako při sestavení a vývoji v Dockeru. Závislosti
se instalují z verzovaného npm lockfile:

```sh
npm ci
```

## Vývoj

```sh
npm run serve
```

Aplikace běží pod `/landing` a používá relativní API základ `/api`.
Vývojová proxy v `vue.config.js` míří na `http://server.cityvizor:3000`
podle konfigurace Docker Compose.

## Produkční sestavení

```sh
npm run build
```

## Lint

```sh
npm run lint
```

Příkaz standardně také opravuje soubory. Pro kontrolu bez úprav použij
`npm run lint -- --no-fix`.

## Konfigurace

Viz [dokumentace Vue CLI](https://cli.vuejs.org/config/).

## Docker

```sh
docker build --target prod -t cityvizor-landing-page .
```

Produkční obraz obsluhuje statické soubory pomocí nginx. Obsah stránek se
načítá za běhu z `/landing/cfg/content.json`, nezávisle na Node.js použitém
pro sestavení. `VUE_PUBLIC_PATH` nastavuje základní cestu při sestavení.
