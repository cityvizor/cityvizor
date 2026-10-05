exports.up = async function (knex) {
  await knex.schema.raw(`
    CREATE TABLE data.accounting_year_summaries (
      profile_id integer NOT NULL,
      year integer NOT NULL,
      income_amount numeric NOT NULL DEFAULT 0,
      budget_income_amount numeric NOT NULL DEFAULT 0,
      expenditure_amount numeric NOT NULL DEFAULT 0,
      budget_expenditure_amount numeric NOT NULL DEFAULT 0,
      computed_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT accounting_year_summaries_pkey
        PRIMARY KEY (profile_id, year),
      CONSTRAINT accounting_year_summaries_year_fkey
        FOREIGN KEY (profile_id, year)
        REFERENCES app.years (profile_id, year)
        ON UPDATE CASCADE ON DELETE CASCADE
    );

    CREATE TABLE data.accounting_group_summaries (
      profile_id integer NOT NULL,
      year integer NOT NULL,
      field character varying NOT NULL,
      group_id character varying NOT NULL,
      income_amount numeric NOT NULL DEFAULT 0,
      budget_income_amount numeric NOT NULL DEFAULT 0,
      expenditure_amount numeric NOT NULL DEFAULT 0,
      budget_expenditure_amount numeric NOT NULL DEFAULT 0,
      computed_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT accounting_group_summaries_pkey
        PRIMARY KEY (profile_id, year, field, group_id),
      CONSTRAINT accounting_group_summaries_field_check
        CHECK (field IN ('paragraph', 'item')),
      CONSTRAINT accounting_group_summaries_year_fkey
        FOREIGN KEY (profile_id, year)
        REFERENCES app.years (profile_id, year)
        ON UPDATE CASCADE ON DELETE CASCADE
    );

    CREATE INDEX accounting_profile_year_idx
      ON data.accounting (profile_id, year);
  `);
};

exports.down = async function (knex) {
  await knex.schema.raw(`
    DROP TABLE data.accounting_group_summaries;
    DROP TABLE data.accounting_year_summaries;
    DROP INDEX data.accounting_profile_year_idx;
  `);
};
