const FEATURE_FLAG = "exclude-internal-transfers";
const transferColumns = [
  "actual_internal_transfer_income_amount",
  "budget_internal_transfer_income_amount",
  "actual_internal_transfer_expenditure_amount",
  "budget_internal_transfer_expenditure_amount",
];

exports.up = async knex => {
  // This scope covers an entity's own accounts/funds, not transfers between
  // a statutory city and its districts (4137/4251/5347/6363).
  await knex.schema.raw(`
    CREATE FUNCTION public.is_internal_transfer(item integer)
    RETURNS boolean LANGUAGE sql IMMUTABLE PARALLEL SAFE AS $$
      SELECT COALESCE(item IN (4133, 4134, 4138, 4139,
                               5342, 5344, 5345, 5348, 5349), false)
    $$;
  `);

  for (const table of [
    "accounting_year_summaries",
    "accounting_group_summaries",
  ]) {
    await knex.schema.raw(`
      ALTER TABLE data.${table}
      ${transferColumns.map(column => `ADD COLUMN ${column} numeric NOT NULL DEFAULT 0`).join(",\n")};
    `);
  }

  // Populate existing summaries, including hidden years. The importer maintains
  // these columns on every subsequent rebuild, independently of either flag.
  for (const field of ["paragraph", "item", null]) {
    const group = field
      ? `COALESCE(SUBSTRING(${field}::varchar, 1, 2), '')`
      : null;
    const table = field
      ? "accounting_group_summaries"
      : "accounting_year_summaries";
    await knex.schema.raw(`
      WITH transfers AS (
        SELECT profile_id, year ${group ? `, ${group} AS group_id` : ""},
          COALESCE(SUM(CASE WHEN item < 5000 AND type <> 'ROZ' THEN amount ELSE 0 END), 0)
            AS actual_internal_transfer_income_amount,
          COALESCE(SUM(CASE WHEN item < 5000 AND type = 'ROZ' THEN amount ELSE 0 END), 0)
            AS budget_internal_transfer_income_amount,
          COALESCE(SUM(CASE WHEN item >= 5000 AND type <> 'ROZ' THEN amount ELSE 0 END), 0)
            AS actual_internal_transfer_expenditure_amount,
          COALESCE(SUM(CASE WHEN item >= 5000 AND type = 'ROZ' THEN amount ELSE 0 END), 0)
            AS budget_internal_transfer_expenditure_amount
        FROM data.accounting
        WHERE public.is_internal_transfer(item)
        GROUP BY profile_id, year ${group ? `, ${group}` : ""}
      )
      UPDATE data.${table} s
      SET ${transferColumns.map(column => `${column} = t.${column}`).join(",\n")}
      FROM transfers t
      WHERE s.profile_id = t.profile_id AND s.year = t.year
      ${field ? `AND s.field = '${field}' AND s.group_id = t.group_id` : ""};
    `);
  }

  // Keep classification rows and zero-valued groups so legacy and precomputed
  // queries retain identical year/group visibility, including NULL items.
  await knex.schema.raw(`
    CREATE VIEW public.accounting_without_internal_transfers AS
    SELECT profile_id, year, type, paragraph, item, unit, event,
      CASE WHEN public.is_internal_transfer(item) THEN 0::numeric ELSE income_amount END AS income_amount,
      CASE WHEN public.is_internal_transfer(item) THEN 0::numeric ELSE budget_income_amount END AS budget_income_amount,
      CASE WHEN public.is_internal_transfer(item) THEN 0::numeric ELSE expenditure_amount END AS expenditure_amount,
      CASE WHEN public.is_internal_transfer(item) THEN 0::numeric ELSE budget_expenditure_amount END AS budget_expenditure_amount,
      financing_amount, budget_financing_amount
    FROM public.accounting;
  `);

  for (const level of ["year", "group"]) {
    await knex.schema.raw(`
      CREATE VIEW public.accounting_${level}_summaries_without_internal_transfers AS
      SELECT profile_id, year, ${level === "group" ? "field, group_id," : ""}
        actual_income_amount - actual_internal_transfer_income_amount AS actual_income_amount,
        budget_income_amount - budget_internal_transfer_income_amount AS budget_income_amount,
        actual_expenditure_amount - actual_internal_transfer_expenditure_amount AS actual_expenditure_amount,
        budget_expenditure_amount - budget_internal_transfer_expenditure_amount AS budget_expenditure_amount,
        actual_financing_amount, budget_financing_amount, computed_at
      FROM data.accounting_${level}_summaries;
    `);
  }

  await knex("app.feature_flags")
    .insert({ name: FEATURE_FLAG, enabled: false })
    .onConflict("name")
    .ignore();
};

exports.down = async knex => {
  await knex("app.feature_flags").where({ name: FEATURE_FLAG }).delete();
  await knex.schema.raw(`
    DROP VIEW public.accounting_group_summaries_without_internal_transfers;
    DROP VIEW public.accounting_year_summaries_without_internal_transfers;
    DROP VIEW public.accounting_without_internal_transfers;
    DROP FUNCTION public.is_internal_transfer(integer);
  `);
  for (const table of [
    "accounting_year_summaries",
    "accounting_group_summaries",
  ]) {
    await knex.schema.raw(`
      ALTER TABLE data.${table}
      ${transferColumns.map(column => `DROP COLUMN ${column}`).join(",\n")};
    `);
  }
};
