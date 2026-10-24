exports.up = async function (knex) {
  await knex("app.import_formats").insert({ format: "ginis_kxx" });
};

exports.down = async function (knex) {
  const existingImport = await knex("app.imports")
    .where("format", "ginis_kxx")
    .first();
  if (existingImport) {
    throw new Error("Cannot remove ginis_kxx format while import history exists.");
  }
  // The existing FK uses ON DELETE CASCADE; preserve import history.
  await knex("app.import_formats").where("format", "ginis_kxx").delete();
};
