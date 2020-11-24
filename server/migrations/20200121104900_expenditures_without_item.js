
exports.up = async function (knex) {  
   await knex.schema.raw(`
   CREATE OR REPLACE VIEW public.accounting
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
            WHEN ((acc.item >= 5000 AND acc.item < 8000) OR (acc.paragraph IS NOT NULL AND acc.item IS NULL)) AND acc.type::text <> 'ROZ'::text THEN acc.amount
            ELSE 0::numeric
        END) AS expenditure_amount,
    sum(
        CASE
            WHEN ((acc.item >= 5000 AND acc.item < 8000) OR (acc.paragraph IS NOT NULL AND acc.item IS NULL)) AND acc.type::text = 'ROZ'::text THEN acc.amount
            ELSE 0::numeric
        END) AS budget_expenditure_amount
   FROM app.profiles p
     LEFT JOIN data.accounting acc ON acc.profile_id = p.id
     JOIN years y ON y.year = acc.year AND y.profile_id = acc.profile_id
  GROUP BY p.id, acc.year, acc.type, acc.paragraph, acc.item, acc.unit, acc.event;
   `)

};

exports.down = async function (knex) {

  await knex.schema.raw(`
  CREATE OR REPLACE VIEW public.accounting
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
  GROUP BY p.id, acc.year, acc.type, acc.paragraph, acc.item, acc.unit, acc.event;
  `);

};
