import { Knex } from "knex";


export async function up (knex: Knex): Promise<void> {
  return knex.schema.createTable('user_recipes', table => {
    table.increments('id').unique()
    table.integer('user_id')
    table.integer('recipe_id')
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('user_recipes')
}
