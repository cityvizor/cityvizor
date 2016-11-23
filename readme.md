# Supervizor Plus

Přehledný rozklikávací rozpočet s plněním na jednotlivé faktury a dalšími funkcemi pro samosprávy:

- rozpočet (celkový přehled, projekty)
- plnění rozpočtu (výdaje po dodavatelích, výdaje po projektech, jednotlivé faktury)
- úřední deska (za pomoci [MapaSamosprávy.cz](http://www.mapasamospravy.cz/)
- [Otevřená Města](http://www.otevrenamesta.cz/) vám poskytují tuto aplikaci jako službu

Data jsou čerpána z otevřených dat (opendat) dané obce či samosprávy.

## Ukázka

Celkový pohled na výdaje samosprávy:

![Celkový pohled na výdaje samosprávy](example-1.png)

Podrobný pohled na ...:

![Podrobný pohled na ...](example-2.png)


## Instalace

**Potřebné balíčky**

Ubuntu: `sudo apt-get install mongodb`

Fedora 24: `sudo dnf install mongodb mongodb-server-3.2.8-2`

Společné:
```
npm install
./node_modules/typescript/bin/ts
npm start
```

Následně aplikace běží na adrese: `http://localhost:3000/`
