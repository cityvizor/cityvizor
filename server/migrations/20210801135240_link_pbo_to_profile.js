exports.up = async function (knex) {
  return knex.schema
    .alterTable('app.profiles', table => {
      table
        .integer('parent')
        .references('id')
        .inTable('app.profiles')
        .onDelete('SET NULL');
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

exports.down = async function (knex) {
  await knex.schema
    .alterTable('app.profiles', table => {
      table.dropColumn('parent');
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
    profiles.type
   FROM app.profiles
  WHERE profiles.status::text <> 'hidden'::text;
  `);
    });
};
