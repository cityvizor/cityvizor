exports.up = async function (knex) {
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
};

exports.down = function (knex) {
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
  WHERE profiles.status::text <> 'hidden'::text;`);
};
