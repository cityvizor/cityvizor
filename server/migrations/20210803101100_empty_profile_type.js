exports.up = async function (knex) {
  return knex("app.profile_types").insert({ type: "empty" });
};

exports.down = async function (knex) {
  return knex("app.profile_types").where("type", "empty").delete;
};
