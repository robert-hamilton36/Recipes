import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary()
    table.string('email').unique()
    table.string('first_name')
    table.string('last_name')
    table.string('password_hash')
    table.timestamp('created_at')
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users')
}

