import { Knex } from "knex";

export async function up (knex: Knex): Promise<void> {
  return knex.schema.createTable('recipe_ingredients', table => {
    table.increments('id')
    table.integer('recipe_id')
    table.integer('ingredient_id')
    table.text('ingredient_name')
    table.integer('quantity_amount')
    table.text('quantity_unit')
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('recipe_ingredients')
}
