const profileColumns = `
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
  profiles.type,
  profiles.parent,
  profiles.popup_name,
  profiles.sum_mode,
  profiles.pbo_category_id,
  profiles.section_id
`;

exports.up = async knex => {
  await knex.schema.raw(`
    ALTER TABLE app.profiles
      ADD COLUMN exclude_internal_transfers boolean NOT NULL DEFAULT false;
    CREATE OR REPLACE VIEW public.profiles AS
      SELECT ${profileColumns}, profiles.exclude_internal_transfers
      FROM app.profiles;
  `);
};

exports.down = async knex => {
  // PostgreSQL cannot remove a view column with CREATE OR REPLACE VIEW.
  // Do not cascade: unexpected dependencies must abort the rollback.
  await knex.schema.raw(`
    DROP VIEW public.profiles;
    CREATE VIEW public.profiles AS SELECT ${profileColumns} FROM app.profiles;
    ALTER TABLE app.profiles DROP COLUMN exclude_internal_transfers;
  `);
};
