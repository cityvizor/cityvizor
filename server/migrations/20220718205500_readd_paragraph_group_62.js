exports.up = async function (knex) {
  return knex("data.codelists").insert({
    codelist: "paragraph-groups",
    id: "62",
    name: "Jiné veřejné služby a činnosti",
    validFrom: "1990-01-01T00:00:00.000Z",
  });
};

exports.down = async function (knex) {
  return knex("data.codelists")
    .where("codelist", "paragraph-groups")
    .andWhere("id", "62")
    .delete();
};
