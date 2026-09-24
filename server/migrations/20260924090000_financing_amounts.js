const FEATURE_FLAG = "dashboard-financing-toggle";

const accountingView = ({ includeFinancingColumns }) => `
CREATE OR REPLACE VIEW public.accounting AS
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
    END
  ) AS income_amount,
  sum(
    CASE
      WHEN (acc.item < 5000 OR acc.item >= 8000) AND acc.type::text = 'ROZ'::text THEN acc.amount
      ELSE 0::numeric
    END
  ) AS budget_income_amount,
  sum(
    CASE
      WHEN ((acc.item >= 5000 AND acc.item < 8000) OR (acc.paragraph IS NOT NULL AND acc.item IS NULL)) AND acc.type::text <> 'ROZ'::text THEN acc.amount
      ELSE 0::numeric
    END
  ) AS expenditure_amount,
  sum(
    CASE
      WHEN ((acc.item >= 5000 AND acc.item < 8000) OR (acc.paragraph IS NOT NULL AND acc.item IS NULL)) AND acc.type::text = 'ROZ'::text THEN acc.amount
      ELSE 0::numeric
    END
  ) AS budget_expenditure_amount${
    includeFinancingColumns
      ? `,
  sum(
    CASE
      WHEN acc.item >= 8000 AND acc.type::text <> 'ROZ'::text THEN acc.amount
      ELSE 0::numeric
    END
  ) AS financing_amount,
  sum(
    CASE
      WHEN acc.item >= 8000 AND acc.type::text = 'ROZ'::text THEN acc.amount
      ELSE 0::numeric
    END
  ) AS budget_financing_amount`
      : ""
  }
FROM app.profiles p
  LEFT JOIN data.accounting acc ON acc.profile_id = p.id
  JOIN years y ON y.year = acc.year AND y.profile_id = acc.profile_id
GROUP BY p.id, acc.year, acc.type, acc.paragraph, acc.item, acc.unit, acc.event;
`;

exports.up = async knex => {
  await knex.schema.raw(accountingView({ includeFinancingColumns: true }));

  await knex("app.feature_flags")
    .insert({ name: FEATURE_FLAG, enabled: false })
    .onConflict("name")
    .ignore();
};

exports.down = async knex => {
  await knex("app.feature_flags").where({ name: FEATURE_FLAG }).delete();

  await knex.schema.raw(`
    DROP VIEW public.accounting;
    ${accountingView({ includeFinancingColumns: false })}
  `);
};
