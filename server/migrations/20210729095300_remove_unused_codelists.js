exports.up = async function (knex) {
  // Remove unused codelists from the database
  return knex("data.codelists")
    .where("codelist", "=", "pbo-su-inc-groups")
    .andWhere("id", "=", "61")
    .orWhere("id", "=", "62")
    .orWhere("id", "=", "65")
    .delete();
};

exports.down = async function (knex) {
  const rows = [
    { codelist: "pbo-su-inc-groups", id: 61, name: "61x" },
    { codelist: "pbo-su-inc-groups", id: 62, name: "62x" },
    { codelist: "pbo-su-inc-groups", id: 65, name: "65x" },
  ];

  return await knex("data.codelists").insert(rows);
};
