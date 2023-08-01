exports.up = async function (knex) {
  return await knex.schema.raw(`
  CREATE OR REPLACE VIEW public.pbo_payments AS
  SELECT
    payments.profile_id,
    payments.year,
    payments.paragraph,
    payments.item,
    payments.event,
    CASE
        WHEN payments.item >= 600
            AND payments.item < 700 THEN payments.amount
        ELSE 0::numeric
    END AS income_amount,
    CASE
        WHEN payments.item >= 500
            AND payments.item < 600 THEN payments.amount
        ELSE 0::numeric
    END AS expenditure_amount,
    payments.date,
    payments.counterparty_id,
    payments.counterparty_name,
    payments.description
  FROM data.payments payments
  JOIN years y ON y.year = payments.year
  AND y.profile_id = payments.profile_id
  `);
};

exports.down = async function (knex) {
  return await knex.schema.raw('DROP VIEW public.pbo_payments');
};
