exports.up = async function(knex) {
  return knex.schema.alterTable("app.imports", table => {
      table.boolean("append").defaultTo(false)
      table.text("logs")
  })
}

exports.down = async function(knex) {
  return knex.schema.alterTable("app.imports", table => {
      table.dropColumn("append")
      table.dropColumn("logs")
  })
}