import { Knex } from "knex";


export async function up (knex: Knex): Promise<void> {
  return knex.schema.createTable('recipes', table => {
    table.increments('id')
    table.string('name')
    table.integer('cook_time_quantity')
    table.string('cook_time_unit')
    table.integer('prep_time_quantity')
    table.string('prep_time_unit')
    table.string('instructions')
    table.string('notes')
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('recipes')
}
