exports.up = async function (knex) {
  await knex.schema.raw(`
    ALTER TABLE data.accounting_year_summaries
      ADD COLUMN financing_amount numeric NOT NULL DEFAULT 0,
      ADD COLUMN budget_financing_amount numeric NOT NULL DEFAULT 0;

    ALTER TABLE data.accounting_group_summaries
      ADD COLUMN financing_amount numeric NOT NULL DEFAULT 0,
      ADD COLUMN budget_financing_amount numeric NOT NULL DEFAULT 0;
  `);
};

exports.down = async function (knex) {
  await knex.schema.raw(`
    ALTER TABLE data.accounting_group_summaries
      DROP COLUMN budget_financing_amount,
      DROP COLUMN financing_amount;

    ALTER TABLE data.accounting_year_summaries
      DROP COLUMN budget_financing_amount,
      DROP COLUMN financing_amount;
  `);
};
