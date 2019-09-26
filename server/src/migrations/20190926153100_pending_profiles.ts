import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {

  return knex.schema.raw(`CREATE OR REPLACE VIEW public.profiles
 AS
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
  profiles.main
FROM app.profiles
WHERE profiles.status != 'hidden';`)


}

export async function down(knex: Knex): Promise<any> {

  return knex.schema.raw(`CREATE OR REPLACE VIEW public.profiles
  AS
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
     profiles.main
    FROM app.profiles
   WHERE profiles.status::text = 'visible'::text;`);
}