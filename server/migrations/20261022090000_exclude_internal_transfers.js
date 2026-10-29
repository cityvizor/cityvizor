const FEATURE_FLAG = "exclude-internal-transfers";
const transferColumns = [
  "actual_internal_transfer_income_amount",
  "budget_internal_transfer_income_amount",
  "actual_internal_transfer_expenditure_amount",
  "budget_internal_transfer_expenditure_amount",
];

// Fixed snapshot for reproducible migrations; runtime rules live in src/accounting-rules.ts.
const incomeItems = [4133, 4134, 4138, 4139];
const expenditureItems = [5342, 5344, 5345, 5348, 5349];

exports.up = async knex => {
  for (const table of [
    "accounting_year_summaries",
    "accounting_group_summaries",
  ]) {
    await knex.schema.raw(`
      ALTER TABLE data.${table}
      ${transferColumns.map(column => `ADD COLUMN ${column} numeric NOT NULL DEFAULT 0`).join(",\n")};
    `);
  }

  // Fill existing summaries, including hidden years, before the feature is enabled.
  for (const field of ["paragraph", "item", null]) {
    const group = field
      ? `COALESCE(SUBSTRING(${field}::varchar, 1, 2), '')`
      : null;
    const table = field
      ? "accounting_group_summaries"
      : "accounting_year_summaries";
    await knex.schema.raw(
      `
      WITH transfers AS (
        SELECT profile_id, year ${group ? `, ${group} AS group_id` : ""},
          COALESCE(SUM(CASE WHEN item = ANY(?::integer[]) AND type <> 'ROZ' THEN amount ELSE 0 END), 0)
            AS actual_internal_transfer_income_amount,
          COALESCE(SUM(CASE WHEN item = ANY(?::integer[]) AND type = 'ROZ' THEN amount ELSE 0 END), 0)
            AS budget_internal_transfer_income_amount,
          COALESCE(SUM(CASE WHEN item = ANY(?::integer[]) AND type <> 'ROZ' THEN amount ELSE 0 END), 0)
            AS actual_internal_transfer_expenditure_amount,
          COALESCE(SUM(CASE WHEN item = ANY(?::integer[]) AND type = 'ROZ' THEN amount ELSE 0 END), 0)
            AS budget_internal_transfer_expenditure_amount
        FROM data.accounting
        WHERE item = ANY(?::integer[])
        GROUP BY profile_id, year ${group ? `, ${group}` : ""}
      )
      UPDATE data.${table} s
      SET ${transferColumns.map(column => `${column} = t.${column}`).join(",\n")}
      FROM transfers t
      WHERE s.profile_id = t.profile_id AND s.year = t.year
      ${field ? `AND s.field = '${field}' AND s.group_id = t.group_id` : ""};
    `,
      [
        incomeItems,
        incomeItems,
        expenditureItems,
        expenditureItems,
        [...incomeItems, ...expenditureItems],
      ]
    );
  }

  await knex("app.feature_flags")
    .insert({ name: FEATURE_FLAG, enabled: false })
    .onConflict("name")
    .ignore();
};

exports.down = async knex => {
  await knex("app.feature_flags").where({ name: FEATURE_FLAG }).delete();
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
