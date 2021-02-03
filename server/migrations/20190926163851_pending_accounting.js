exports.up = async function (knex) {
  await knex.schema.raw(`CREATE OR REPLACE VIEW public.years
  AS
  SELECT y.profile_id,
     y.year,
     y.validity
    FROM app.years y
      JOIN app.profiles p ON y.profile_id = p.id
   WHERE y.hidden <> true AND p.status <> 'hidden';`);
};

exports.down = async function (knex) {
  await knex.schema.raw(`CREATE OR REPLACE VIEW public.years
  AS
  SELECT y.profile_id,
     y.year,
     y.validity
    FROM app.years y
      JOIN app.profiles p ON y.profile_id = p.id
   WHERE y.hidden <> true AND p.status = 'visible';`);
};
