import { Knex } from "knex";

export async function up (knex: Knex): Promise<void> {
  return knex.schema.createTable('recipeIngredients', table => {
    table.increments('recipeIngredientsId')
    table.integer('recipeId')
    table.integer('ingredientId')
    table.text('ingredientName')
    table.integer('quantityAmount')
    table.text('quantityUnit')
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('recipeIngredients')
}
