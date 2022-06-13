import { Knex } from "knex"

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("recipes").del()
  await knex("ingredients").del()
  await knex("recipe_ingredients").del()
  await knex("user_recipes").del()

  // Inserts seed entries
  await knex("recipes").insert([
    {
      id: 1,
      name: "Healthier Date Cashew Caramel Chocolate Slice",
      cook_time_quantity: 15,
      cook_time_unit: "mins",
      prep_time_quantity: 15,
      prep_time_unit: "mins",
      instructions:
        '[{"stepNumber":1,"instructions":"mix oats and coconut thread together bake for 10 mins at 180 C"},{"stepNumber":2,"instructions":"boil dates until softer pulp and blend together with cashews"},{"stepNumber":3,"instructions":"Pour the date cashew mix on top of the base. Refridgerate for 4 hours"}]',
      notes: "none",
    },
  ])

  await knex("ingredients").insert([
    {
      id: 1,
      name: "Dates",
    },
    {
      id: 2,
      name: "Oats",
    },
    {
      id: 3,
      name: "Coconut Thread",
    },
    {
      id: 4,
      name: "Cashews",
    },
  ])

  await knex("recipe_ingredients").insert([
    {
      id: 1,
      recipe_id: 1,
      ingredient_id: 1,
      ingredient_name: "Dates",
      quantity_amount: 1,
      quantity_unit: "Cups",
    },
    {
      id: 2,
      recipe_id: 1,
      ingredient_id: 2,
      ingredient_name: "Oates",
      quantity_amount: 1,
      quantity_unit: "Cups",
    },
    {
      id: 3,
      recipe_id: 1,
      ingredient_id: 3,
      ingredient_name: "Coconut Thread",
      quantity_amount: 1,
      quantity_unit: "Cups",
    },
    {
      id: 4,
      recipe_id: 1,
      ingredient_id: 4,
      ingredient_name: "Cashews",
      quantity_amount: 1,
      quantity_unit: "Cups",
    },
  ])

  await knex("user_recipes").insert([
    {
      id: 1,
      user_id: 1,
      recipe_id: 1,
    },
  ])
}
