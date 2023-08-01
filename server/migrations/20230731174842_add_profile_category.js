exports.up = function (knex) {
  return knex.schema
    .createTable('app.pbo_categories', table => {
      table.increments('id')
      table.string('category_cs_name', 50)
      table.string('category_en_name', 50)
    })
    .then(() => {
      return knex('app.pbo_categories')
        .insert([{ category_cs_name: "Nezařazeno", category_en_name: "Undefined" },
        { category_cs_name: "Jiné", category_en_name: "Other" },
        { category_cs_name: "Vzdělávání", category_en_name: "Education" },
        { category_cs_name: "Sociální služby", category_en_name: "Social services" },
        { category_cs_name: "Kultura", category_en_name: "Culture" }]);
    })
    .then(() => {
      return knex.schema.alterTable('app.profiles', table => {
        table.integer('category_id')
        table.foreign('category_id').references('id').inTable('app.pbo_categories')
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
      return knex.schema.dropTable('app.pbo_categories')
    });
};
