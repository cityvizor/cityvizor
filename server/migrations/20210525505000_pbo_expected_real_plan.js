exports.up = async function (knex) {
  return (
    knex.schema
      .createTable("data.pbo_real_plans", table => {
        table.integer("profile_id");
        table.foreign("profile_id").references("id").inTable("app.profiles");
        table.integer("year");
        table
          .foreign(["year", "profile_id"])
          .references(["year", "profile_id"])
          .inTable("app.years");
        table.string("type");
        table.integer("sa");
        table.integer("aa");
        table.decimal("amount", 14, 2);
      })
      .then(() => {
        return knex("app.import_formats").insert([
          { format: "pbo_real_plan" },
          { format: "pbo_expected_plan" },
        ]);
      })
      // This allows to modify the app.import_formats table
      .then(() => {
        return knex.schema.alterTable("app.imports", table => {
          table.dropForeign("format");

          table
            .foreign("format")
            .references("format")
            .inTable("app.import_formats")
            .onDelete("CASCADE");
        });
      })
      .then(() => {
        return knex.schema.renameTable("data.pbo_plans", "pbo_expected_plans");
      })
      .then(() => {
        return knex.schema.raw("DROP VIEW public.pbo_plans");
      })
      .then(() => {
        return knex.schema.raw(`
        CREATE OR REPLACE VIEW public.pbo_plans AS
        SELECT 
          plans.profile_id,
          plans.year,
          plans.sa,
          plans.aa,
          sum(plans.budget_expenditure_amount) as budget_expenditure_amount,
          sum(plans.expenditure_amount) as expenditure_amount,
          sum(plans.budget_income_amount) as budget_income_amount,
          sum(plans.income_amount) as income_amount
      
        FROM (
            (SELECT
                profile_id,
                year,
                sa,
                aa,
                sum(
                    CASE
                        WHEN (sa >= 500 AND sa < 600) THEN amount
                        ELSE 0::numeric
                    END) AS expenditure_amount,
                0::numeric as budget_expenditure_amount,
                sum(
                    CASE
                        WHEN (sa >= 600 AND sa < 700) THEN amount
                        ELSE 0::numeric
                    END) AS income_amount,
                0::numeric as budget_income_amount
            FROM data.pbo_real_plans
            GROUP BY profile_id, year, sa, aa)
            UNION ALL
            (SELECT
                profile_id,
                year,
                sa,
                aa,
                0::numeric as expenditure_amount,
                sum(
                    CASE
                        WHEN (sa >= 500 AND sa < 600) THEN amount
                        ELSE 0::numeric
                    END) AS budget_expenditure_amount,
                0::numeric as income_amount,
                sum(
                    CASE
                        WHEN (sa >= 600 AND sa < 700) THEN amount
                        ELSE 0::numeric
                    END) AS budget_income_amount
            FROM data.pbo_expected_plans
            GROUP BY profile_id, year, sa, aa)
        ) AS plans
        GROUP BY plans.profile_id, plans.year, plans.sa, plans.aa`);
      })
      .then(() => {
        return knex("app.import_formats").where("format", "pbo").delete();
      })
      .then(() => {})
  );
};

exports.down = async function (knex) {
  return knex("app.import_formats")
    .where("format", "pbo_real_plan")
    .orWhere("format", "pbo_expected_plan")
    .delete()
    .then(() => {
      return knex.schema.alterTable("app.imports", table => {
        table.dropForeign("format");
        table
          .foreign("format")
          .references("format")
          .inTable("app.import_formats")
          .onDelete("NO ACTION");
      });
    })
    .then(() => {
      return knex("app.import_formats").insert({ format: "pbo" });
    })
    .then(() => {
      return knex.schema.renameTable("data.pbo_expected_plans", "pbo_plans");
    })
    .then(() => {
      return knex.schema.raw("DROP VIEW public.pbo_plans");
    })
    .then(() => {
      return knex.schema.raw(`
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
    })
    .then(() => {
      return knex.schema.dropTable("data.pbo_real_plans");
    });
};
