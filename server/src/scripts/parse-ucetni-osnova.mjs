/*
https://monitor.statnipokladna.cz/data/xml/uctosnova.xml

Requires xml2js lib (install it globally, as it isn't needed in the codebase)
(sudo) npm install -g xml2js

You're going to need a moderately recent node.js (>= 14.8.0) to allow top-level await (notice the .mjs extension)

Description: Parses ucetni osnova .XML from MFCR and creates a knex migration file
Usage: node parse-ucetni-osnova.mjs <OSNOVA.xml> | xclip -selection c

Paste the resulting JSON string into a migration file and code up the DB logic (insert on duplicate key)
*/

import xml2js from "xml2js";
import fs from "fs";
import process from "process";

const parser = new xml2js.Parser({ explicitArray: false });

// format: 31-12-2014
const parseDate = date => {
  const [day, month, year] = date.match(/(\d+)-(\d+)-(\d+)/).slice(1);
  const parsedDate = Date.parse(`${year}-${month}-${day}`);
  if (!parsedDate) throw Error(`Failed to parse date: ${date}`);
  return parsedDate;
};

const osnovaJson = await parser.parseStringPromise(
  fs.readFileSync(process.argv[2])
);
const entries = osnovaJson["ciselnik_UCTOSNOVA_export_20210406"]["row"]
  .filter(row => {
    // Only valid entries
    return (
      parseDate(row["start_date"]) <= Date.now() &&
      parseDate(row["end_date"]) > Date.now()
    );
  })
  .filter(row => {
    // Category name, we care only about Náklady (5xx) and Výnosy (6xx)
    return row["synuc"]?.startsWith("5") || row["synuc"]?.startsWith("6");
  })
  .map(row => {
    return {
      codelist: "pbo-su",
      id: row["synuc"],
      name: row["polvyk_nazev"],
    };
  });
entries.sort((a, b) => (a.id > b.id ? 1 : -1));
// Hardcoding this, because the group names are apparently not "official".
const groups = [
  [50, "Spotřebované nákupy"],
  [51, "Služby"],
  [52, "Osobní náklady"],
  [53, "Daně a poplatky"],
  [54, "Jiné provozní náklady"],
  [
    55,
    "Odpisy, rezervy, komplexní náklady příštích období a opravné položky v provozní oblasti",
  ],
  [56, "Finanční náklady"],
  [57, "Rezervy a opravné položky ve finanční oblasti"],
  [58, "Změna stavu zásob vlastní činnosti a aktivace"],
  [59, "Daně z příjmů, převodové účty a rezerva na daň z příjmů"],
  [60, "Tržby za vlastní výkony a zboží"],
  [61, "61x"],
  [62, "62x"],
  [63, "Výnosy z daní a poplatků"],
  [64, "Jiné provozní výnosy"],
  [65, "65x"],
  [66, "Finanční výnosy"],
  [67, "Výnosy z transferů"],
  [68, "68x"],
  [69, "Převodové účty"],
].map(([id, name]) => {
  return {
    codelist: id.toString().startsWith("5")
      ? "pbo-su-exp-groups"
      : "pbo-su-inc-groups",
    id: id,
    name: name,
  };
});

process.stdout.write(
  JSON.stringify([...groups, ...entries]).replace(/},/g, "},\n")
);
