/*
Description: Parses a codelist .JSON from MFCR and creates a knex migration file
Usage: node parse-codelists.js <CODELIST.JSON> | xclip -selection c

Install axios separately: npm install -g axios
Paste the resulting JSON string into a migration file and code up the DB logic (insert on duplicate key)
*/

const datasets = {
  "paragraphs": "https://opendata.mfcr.cz/exports/paragraf/paragraf.json"
}

// Change this
const name = "paragraphs"
const dataset = datasets[name]

import axios from 'axios'
const rawJson = (await axios.get(dataset)).data

const converted = rawJson
  .filter(item => item.id_level === 4)
  .filter(item => {
    var older_date = Date.parse(item.datum_platnosti_do);
    var newer_date = Date.parse(item.datum_platnosti_od);
    // The dataset has things like datum_platnosti_od: 9999 and datum_platnosti_do: 2015
    if (newer_date < older_date) {
      var tmp = older_date;
      older_date = newer_date;
      newer_date = tmp;
    }
    return older_date < Date.now() && newer_date > Date.now()
  })
  .map(item => {
    return {
      id: item.id,
      name: item.text_popis_dlouhy,
    };
  });

process.stdout.write(
  JSON.stringify({name, data: converted}).replace(/},/g, '},\n')
);
