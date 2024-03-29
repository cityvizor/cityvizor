exports.up = async function (knex) {
  return knex.schema
    .createTable("app.profile_types", table => {
      table.string("type", 20).notNullable().unique();
    })
    .then(() => {
      return knex("app.profile_types").insert([
        { type: "municipality" },
        { type: "pbo" },
      ]);
    })
    .then(() => {
      return knex.schema.alterTable("app.profiles", table => {
        table
          .string("type", 20)
          .notNullable()
          .default("municipality")
          .references("type")
          .inTable("app.profile_types");
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
  profiles.type 
FROM app.profiles
WHERE profiles.status::text <> 'hidden'::text`);
    });
};

exports.down = async function (knex) {
  return knex.schema
    .alterTable("app.imports", table => {
      table.dropColumn("type");
    })
    .then(() => {
      knex.schema.dropTable("app.profile_types");
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
FROM app.profiles
WHERE profiles.status::text <> 'hidden'::text`);
    });
};
