import { Knex } from "knex";


export async function up (knex: Knex): Promise<void> {
  return knex.schema.createTable('ingredients', table => {
    table.increments('ingredientId')
    table.text('name').unique()
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('ingredients')
}