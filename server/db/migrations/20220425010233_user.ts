import { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.increments("userId").primary()
    table.string("email").unique()
    table.string("firstName")
    table.string("lastName")
    table.string("passwordHash")
    table.timestamp("createdAt")
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users")
}
