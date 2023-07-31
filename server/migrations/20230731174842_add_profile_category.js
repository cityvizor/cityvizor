exports.up = function (knex) {
  return knex.schema
    .createTable('app.profile_categories', table => {
      table.increments('id')
      table.string('cs_name', 50)
      table.string('en_name', 50)
    })
    .then(() => {
      return knex('app.profile_categories')
        .insert([{ cs_name: "Nezařazeno", en_name: "Undefined" },
        { cs_name: "Jiné", en_name: "Other" },
        { cs_name: "Vzdělávání", en_name: "Education" },
        { cs_name: "Sociální služby", en_name: "Social services" },
        { cs_name: "Kultura", en_name: "Culture" }]);
    })
    .then(() => {
      return knex.schema.alterTable('app.profiles', table => {
        table.integer('category_id').notNullable().default(1)
        table.foreign('category_id').references('id').inTable('app.profile_categories')
      })
    })
    .then(() => {
      return knex.raw(`
    CREATE OR REPLACE VIEW public.profiles AS SELECT 
      profiles.id,
      profiles.status,
      profiles.url,
      profiles.name,
      profiles.email,
      profiles.avatar_type,
      profiles.ico,
      profiles.databox,
      profiles.edesky,
      profiles.mapasamospravy,
      profiles.gps_x,
      profiles.gps_y,
      profiles.main,
      profiles.type,
      profiles.parent,
      profiles.popup_name,
      profiles.sum_mode,
      profiles.category_id
    FROM app.profiles`);
    });
};

exports.down = function (knex) {
  return knex.raw(`
  CREATE OR REPLACE VIEW public.profiles AS SELECT 
    profiles.id,
    profiles.status,
    profiles.url,
    profiles.name,
    profiles.email,
    profiles.avatar_type,
    profiles.ico,
    profiles.databox,
    profiles.edesky,
    profiles.mapasamospravy,
    profiles.gps_x,
    profiles.gps_y,
    profiles.main,
    profiles.type,
    profiles.parent,
    profiles.popup_name,
    profiles.sum_mode
  FROM app.profiles`)
    .then(() => {
      return knex.schema.alterTable('app.profiles', table => {
        table.dropForeign('category_id')
        table.dropColumn('category_id');
      })
    })
    .then(() => {
      return knex.schema.dropTable('app.profile_categories')
    });
};
