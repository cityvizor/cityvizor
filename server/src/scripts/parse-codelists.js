/*
Description: Parses a codelist .JSON from MFCR and creates a knex migration file
Usage: node parse-codelists.js <CODELIST.JSON> | xclip -selection c

Paste the resulting JSON string into a migration file and code up the DB logic (insert on duplicate key)
*/

const fs = require('fs');
const process = require('process');

const codelistJson = JSON.parse(fs.readFileSync(process.argv[2]));
const converted = codelistJson
  .filter(item => item.id_level === 4)
  .filter(item => Date.parse(item.datum_platnosti_do) > Date.now())
  .map(item => {
    return {
      id: item.id,
      name: item.text_popis_dlouhy,
      // HACK
      validFrom: '1900-01-01T00:00:00.000Z',
    };
  });

process.stdout.write(
  JSON.stringify({name: 'paragraphs', data: converted}).replace(/},/g, '},\n')
);
