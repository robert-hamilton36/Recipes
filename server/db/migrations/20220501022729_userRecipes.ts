import { Knex } from "knex";


export async function up (knex: Knex): Promise<void> {
  return knex.schema.createTable('userRecipes', table => {
    table.increments('userRecipesId').unique()
    table.integer('userId')
    table.integer('recipeId')
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('userRecipes')
}
