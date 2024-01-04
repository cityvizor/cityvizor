exports.up = async (knex) => {
  await knex.raw("ALTER TABLE app.profile_types ADD PRIMARY KEY (type)");
  await knex.raw("ALTER TABLE app.import_formats ADD PRIMARY KEY (format)");
};

exports.down = async (knex) => {
  await knex.raw("ALTER TABLE app.profile_types DROP PRIMARY KEY");
  await knex.raw("ALTER TABLE app.import_formats DROP PRIMARY KEY");
};
