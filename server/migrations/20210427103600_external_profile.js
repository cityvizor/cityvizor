exports.up = async function (knex) {
  return knex("app.profile_types").insert({ type: "external" });
};

exports.down = async function (knex) {
  return knex("app.profile_types").where("type", "external").delete;
};
