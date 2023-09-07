exports.up = function (knex) {
  return knex.schema
    .createTable('app.pbo_categories', table => {
      table.string('pbo_category_id', 16).notNullable().unique();
      table.string('pbo_category_cs_name', 50).notNullable();
      table.string('pbo_category_en_name', 50).notNullable();
    })
    .then(() => {
      return knex('app.pbo_categories').insert([
        {
          pbo_category_id: 'unclassified',
          pbo_category_cs_name: 'Nezařazeno',
          pbo_category_en_name: 'Unclassified',
        },
      ]);
    })
    .then(() => {
      return knex.schema.alterTable('app.profiles', table => {
        table.string('pbo_category_id').nullable();
        table
          .foreign('pbo_category_id')
          .references('pbo_category_id')
          .inTable('app.pbo_categories');
      });
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
      profiles.pbo_category_id
    FROM app.profiles`);
    });
};

exports.down = function (knex) {
  return knex
    .raw(
      `
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
  FROM app.profiles`
    )
    .then(() => {
      return knex.schema.alterTable('app.profiles', table => {
        table.dropForeign('pbo_category_id');
        table.dropColumn('pbo_category_id');
      });
    })
    .then(() => {
      return knex.schema.dropTable('app.pbo_categories');
    });
};
