exports.up = async function (knex) {
  return knex.schema
    .alterTable("app.profiles", table => {
      table.string("popup_name");
    })
    .then(() => {
      return knex.raw(`
  CREATE OR REPLACE VIEW profiles AS 
   SELECT profiles.id,
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
   FROM app.profiles
  WHERE profiles.status::text <> 'hidden'::text;
  `);
    });
};

exports.down = async function (knex) {
  await knex.schema
    .alterTable("app.profiles", table => {
      table.dropColumn("popup_name");
    })
    .then(() => {
      return knex.raw(`
  CREATE OR REPLACE VIEW profiles AS 
   SELECT profiles.id,
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
    profiles.parent
   FROM app.profiles
  WHERE profiles.status::text <> 'hidden'::text;
  `);
    });
};
