exports.config = { transaction: false };

exports.up = async function (knex) {
  await knex.raw(`
    CREATE INDEX CONCURRENTLY IF NOT EXISTS accounting_profile_year_paragraph_idx
    ON data.accounting (profile_id, year, paragraph)
  `);
};

exports.down = async function (knex) {
  await knex.raw(`
    DROP INDEX CONCURRENTLY IF EXISTS data.accounting_profile_year_paragraph_idx
  `);
};
