exports.up = function (knex) {
  return knex.schema
    .alterTable("app.profiles", table => {
      table.string("sum_mode", 20).notNullable().default("complete");
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
        profiles.sum_mode
      FROM app.profiles`);
    });
};

exports.down = function (knex) {
  return knex.schema
    .alterTable("app.profiles", table => {
      table.dropColumn("sum_mode");
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
        profiles.popup_name
      FROM app.profiles`);
    });
};
