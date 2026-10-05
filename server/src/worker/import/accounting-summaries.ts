import { Knex } from "knex";

const amountColumns = `
  COALESCE(SUM(CASE
    WHEN (item < 5000 OR item >= 8000) AND type <> 'ROZ' THEN amount
    ELSE 0::numeric
  END), 0) AS income_amount,
  COALESCE(SUM(CASE
    WHEN (item < 5000 OR item >= 8000) AND type = 'ROZ' THEN amount
    ELSE 0::numeric
  END), 0) AS budget_income_amount,
  COALESCE(SUM(CASE
    WHEN ((item >= 5000 AND item < 8000) OR
      (paragraph IS NOT NULL AND item IS NULL)) AND type <> 'ROZ' THEN amount
    ELSE 0::numeric
  END), 0) AS expenditure_amount,
  COALESCE(SUM(CASE
    WHEN ((item >= 5000 AND item < 8000) OR
      (paragraph IS NOT NULL AND item IS NULL)) AND type = 'ROZ' THEN amount
    ELSE 0::numeric
  END), 0) AS budget_expenditure_amount,
  COALESCE(SUM(CASE
    WHEN item >= 8000 AND type <> 'ROZ' THEN amount
    ELSE 0::numeric
  END), 0) AS financing_amount,
  COALESCE(SUM(CASE
    WHEN item >= 8000 AND type = 'ROZ' THEN amount
    ELSE 0::numeric
  END), 0) AS budget_financing_amount
`;

/** Rebuilds all accounting summaries for one profile and year. */
export async function rebuildAccountingSummaries(
  trx: Knex.Transaction,
  profileId: number,
  year: number
): Promise<void> {
  await trx("data.accounting_group_summaries")
    .where({ profileId, year })
    .delete();
  await trx("data.accounting_year_summaries")
    .where({ profileId, year })
    .delete();

  for (const field of ["paragraph", "item"] as const) {
    await trx.raw(
      `
        INSERT INTO data.accounting_group_summaries (
          profile_id,
          year,
          field,
          group_id,
          income_amount,
          budget_income_amount,
          expenditure_amount,
          budget_expenditure_amount,
          financing_amount,
          budget_financing_amount,
          computed_at
        )
        SELECT
          profile_id,
          year,
          ?,
          COALESCE(SUBSTRING(??::varchar, 1, 2), ''),
          ${amountColumns},
          CURRENT_TIMESTAMP
        FROM data.accounting
        WHERE profile_id = ? AND year = ?
        GROUP BY
          profile_id,
          year,
          COALESCE(SUBSTRING(??::varchar, 1, 2), '')
      `,
      [field, field, profileId, year, field]
    );
  }

  await trx.raw(
    `
      INSERT INTO data.accounting_year_summaries (
        profile_id,
        year,
        income_amount,
        budget_income_amount,
        expenditure_amount,
        budget_expenditure_amount,
        financing_amount,
        budget_financing_amount,
        computed_at
      )
      SELECT
        ?,
        ?,
        COALESCE(SUM(income_amount), 0),
        COALESCE(SUM(budget_income_amount), 0),
        COALESCE(SUM(expenditure_amount), 0),
        COALESCE(SUM(budget_expenditure_amount), 0),
        COALESCE(SUM(financing_amount), 0),
        COALESCE(SUM(budget_financing_amount), 0),
        CURRENT_TIMESTAMP
      FROM data.accounting_group_summaries
      WHERE profile_id = ? AND year = ? AND field = 'paragraph'
    `,
    [profileId, year, profileId, year]
  );
}
