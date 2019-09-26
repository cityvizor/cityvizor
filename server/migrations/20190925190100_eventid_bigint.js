

exports.up = async function(knex) {

  // drop depending objects
  await dropViews(knex);
  await knex.schema.raw("ALTER TABLE data.events DROP CONSTRAINT events_pkey;");

  // alter columns
  await knex.schema.alterTable("data.accounting", table => { table.bigInteger("event").alter(); });
  await knex.schema.alterTable("data.payments", table => { table.bigInteger("event").alter(); });
  await knex.schema.alterTable("data.events", table => { table.bigInteger("id").alter(); });

  // recreate depending objects
  await knex.schema.raw("ALTER TABLE data.events ADD CONSTRAINT events_pkey PRIMARY KEY (profile_id, year, id)")
  await buildViews(knex);

}

exports.down = async function(knex) {

  // drop depending objects
  await dropViews(knex);
  await knex.schema.raw("ALTER TABLE data.events DROP CONSTRAINT events_pkey;");

  // alter columns
  await knex.schema.alterTable("data.accounting", table => { table.integer("event").alter(); });
  await knex.schema.alterTable("data.payments", table => { table.integer("event").alter(); });
  await knex.schema.alterTable("data.events", table => { table.integer("id").alter(); });

  // recreate depending objects
  await knex.schema.raw("ALTER TABLE data.events ADD CONSTRAINT events_pkey PRIMARY KEY (profile_id, year, id)")
  await buildViews(knex);

}

export async function dropViews(db) {
  await db.raw("DROP VIEW public.accounting;");
  await db.raw("DROP VIEW public.events;");
  await db.raw("DROP VIEW public.payments;");
}

export async function buildViews(db) {
  await db.raw(`CREATE OR REPLACE VIEW public.accounting
  AS
  SELECT p.id AS profile_id,
     acc.year,
     acc.type,
     acc.paragraph,
     acc.item,
     acc.unit,
     acc.event,
     sum(
         CASE
             WHEN (acc.item < 5000 OR acc.item >= 8000) AND acc.type::text <> 'ROZ'::text THEN acc.amount
             ELSE 0::numeric
         END) AS income_amount,
     sum(
         CASE
             WHEN (acc.item < 5000 OR acc.item >= 8000) AND acc.type::text = 'ROZ'::text THEN acc.amount
             ELSE 0::numeric
         END) AS budget_income_amount,
     sum(
         CASE
             WHEN acc.item >= 5000 AND acc.item < 8000 AND acc.type::text <> 'ROZ'::text THEN acc.amount
             ELSE 0::numeric
         END) AS expenditure_amount,
     sum(
         CASE
             WHEN acc.item >= 5000 AND acc.item < 8000 AND acc.type::text = 'ROZ'::text THEN acc.amount
             ELSE 0::numeric
         END) AS budget_expenditure_amount
    FROM app.profiles p
      LEFT JOIN data.accounting acc ON acc.profile_id = p.id
      JOIN years y ON y.year = acc.year AND y.profile_id = acc.profile_id
   GROUP BY p.id, acc.year, acc.type, acc.paragraph, acc.item, acc.unit, acc.event;`)

  await db.raw(`CREATE OR REPLACE VIEW public.events
   AS
   SELECT e.profile_id,
      e.year,
      e.id,
      e.name,
      ed.category,
      ed.event_name,
      ed.organization_name,
      ed.description
     FROM data.events e
       JOIN years y ON y.year = e.year AND y.profile_id = e.profile_id
       LEFT JOIN data.event_descriptions ed ON ed.profile_id = e.profile_id AND ed.event_id = e.id AND ed.year = e.year;
  `);

  await db.raw(`CREATE OR REPLACE VIEW public.payments
  AS
  SELECT payments.profile_id,
     payments.year,
     payments.paragraph,
     payments.item,
     payments.unit,
     payments.event,
         CASE
             WHEN payments.item < 5000 OR payments.item >= 7000 THEN payments.amount
             ELSE 0::numeric
         END AS income_amount,
         CASE
             WHEN payments.item >= 5000 AND payments.item < 7000 THEN payments.amount
             ELSE 0::numeric
         END AS expenditure_amount,
     payments.date,
     payments.counterparty_id,
     payments.counterparty_name,
     payments.description
    FROM data.payments payments
      JOIN years y ON y.year = payments.year AND y.profile_id = payments.profile_id;`)
}