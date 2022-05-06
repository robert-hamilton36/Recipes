import { Knex } from "knex";


export async function up (knex: Knex): Promise<void> {
  return knex.schema.createTable('recipes', table => {
    table.increments('recipeId')
    table.string('name')
    table.integer('cookTimeQuantity')
    table.string('cookTimeUnit')
    table.integer('prepTimeQuantity')
    table.string('prepTimeUnit')
    table.string('instructions')
    table.string('notes')
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('recipes')
}
