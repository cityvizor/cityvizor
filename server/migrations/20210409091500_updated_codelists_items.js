// Previous migration inserted new rows as paragraphs, but they should have been inserted as items.
// ...this is also wrong, because the column to update should have been the codelist one, not the name one.
const itemIds = [
  '1229',
  '1235',
  '1357',
  '1358',
  '1362',
  '1379',
  '1385',
  '4251',
  '5177',
  '5216',
  '5811',
  '5903',
  '5904',
  '6316',
  '6363',
];

exports.up = async function (knex) {
  for (const itemId of itemIds) {
    await knex('data.codelists').where('id', itemId).update('name', 'items');
  }
};

exports.down = async function (knex) {
  return knex('data.codelists').delete();
};
