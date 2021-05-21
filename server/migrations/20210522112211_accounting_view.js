exports.up = async function (knex) {
  return await knex.schema.raw(`
  CREATE OR REPLACE VIEW public.pbo_plans AS
  SELECT 
    p.id AS profile_id,
    plans.year,
    plans.type,
    plans.sa,
    plans.aa,
    plans.amount,
    sum(
        CASE
            WHEN (plans.sa >= 500 AND plans.sa < 600) THEN plans.amount
            ELSE 0::numeric
        END) AS expenditure_amount,
    sum(
        CASE
            WHEN (plans.sa >= 500 AND plans.sa < 600) THEN plans.amount
            ELSE 0::numeric
        END) AS budget_expenditure_amount,
    sum(
        CASE
            WHEN (plans.sa >= 600 AND plans.sa < 700) THEN plans.amount
            ELSE 0::numeric
        END) AS income_amount,
    sum(
        CASE
            WHEN (plans.sa >= 600 AND plans.sa < 700) THEN plans.amount
            ELSE 0::numeric
        END) AS budget_income_amount

  FROM app.profiles p
    JOIN data.pbo_plans plans ON plans.profile_id = p.id
    JOIN years y ON y.profile_id = plans.profile_id AND y.year = plans.year 
  GROUP BY p.id, plans.year, plans.type, plans.sa, plans.aa, plans.amount
  `);
};

exports.down = async function (knex) {
  return await knex.schema.raw('DROP VIEW public.pbo_plans');
};
