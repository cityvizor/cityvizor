exports.up = async function (knex) {
  return knex.schema
    .createTable('data.pbo_plans', table => {
      table.integer('profile_id');
      table.foreign('profile_id').references('id').inTable('app.profiles');
      table.integer('year');
      table
        .foreign(['year', 'profile_id'])
        .references(['year', 'profile_id'])
        .inTable('app.years');
      table.string('type');
      table.integer('sa');
      table.integer('aa');
      table.decimal('amount', 14, 2);
    })
    .then(() => {
      return knex('app.import_formats').insert({format: 'pbo'});
    });
};

exports.down = async function (knex) {
  return knex.schema.dropTable('data.pbo_plans').then(() => {
    return knex('app.import_formats').where('format', 'pbo').delete();
  });
};
