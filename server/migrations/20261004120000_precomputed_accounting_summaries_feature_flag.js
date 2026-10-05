const FEATURE_FLAG = "precomputed-accounting-summaries";

exports.up = async knex => {
  await knex("app.feature_flags")
    .insert({ name: FEATURE_FLAG, enabled: false })
    .onConflict("name")
    .ignore();
};

exports.down = knex =>
  knex("app.feature_flags").where({ name: FEATURE_FLAG }).delete();
