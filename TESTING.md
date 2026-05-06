# Testing

## Backend Jest tests

Backend testy se pouští uvnitř běžícího Docker Compose stacku:

```bash
docker compose -f compose.yml -f compose.dev.yml exec server.cityvizor npm test
```

Předtím musí běžet dev stack:

```bash
docker compose -f compose.yml -f compose.dev.yml up -d
```

Spustit jen import test:

```bash
docker compose -f compose.yml -f compose.dev.yml exec server.cityvizor npx jest test/cityvizor-import.test.ts
```

Spustit jen utils test:

```bash
docker compose -f compose.yml -f compose.dev.yml exec server.cityvizor npx jest test/utils.test.ts
```

## Playwright test

Playwright test předpokládá, že aplikace běží na:

```text
http://localhost:4200
```

Spusteni:

```bash
npm run test:e2e
```

Při prvním spuštění může být potřeba stáhnout Chromium:

```bash
npx playwright install chromium
```

