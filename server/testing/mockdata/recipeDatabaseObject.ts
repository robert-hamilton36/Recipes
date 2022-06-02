import { RecipeDatabase, RecipeIngredientDatabase } from "../../types/DatabaseObjects"

export const CaramelSliceDatabaseObject: Partial<RecipeDatabase> = {
  name: "Healthier Date Cashew Caramel Chocolate Slice",
  cook_time_quantity: 30,
  cook_time_unit: 'mins',
  prep_time_quantity: 15,
  prep_time_unit: 'mins',
  instructions: "[{\"stepNumber\":1,\"instructions\":\"mix oats and coconut thread together bake for 10 mins at 180 C\"},{\"stepNumber\":2,\"instructions\":\"boil dates until softer pulp and blend together with cashews\"},{\"stepNumber\":3,\"instructions\":\"Pour the date cashew mix on top of the base. Refridgerate for 4 hours\"}]",
  notes: 'Creating a healthier version seemed like mission impossible at first, but after four attempts I have made a healthy date cashew chocolate caramel slice that mimics the flavour, texture and all round deliciousness of the original'
}

export const CaramelSliceDatabaseObjectWithId: RecipeDatabase = {
  id: 1,
  name: "Healthier Date Cashew Caramel Chocolate Slice",
  cook_time_quantity: 30,
  cook_time_unit: 'mins',
  prep_time_quantity: 15,
  prep_time_unit: 'mins',
  instructions: "[{\"stepNumber\":1,\"instructions\":\"mix oats and coconut thread together bake for 10 mins at 180 C\"},{\"stepNumber\":2,\"instructions\":\"boil dates until softer pulp and blend together with cashews\"},{\"stepNumber\":3,\"instructions\":\"Pour the date cashew mix on top of the base. Refridgerate for 4 hours\"}]",
  notes: 'Creating a healthier version seemed like mission impossible at first, but after four attempts I have made a healthy date cashew chocolate caramel slice that mimics the flavour, texture and all round deliciousness of the original'
}

export const DateIngredientDatabaseObject:Partial<RecipeIngredientDatabase> = {
  recipe_id: 1,
  ingredient_id: 1,
  ingredient_name: "Dates",
  quantity_unit: "g",
  quantity_amount: 400
}

export const DateIngredientDatabaseObjectWithId: RecipeIngredientDatabase = {
  id: 1,
  recipe_id: 1,
  ingredient_id: 1,
  ingredient_name: "Dates",
  quantity_unit: "g",
  quantity_amount: 400
}

export const CashewsIngredientDatabaseObjectWithId: RecipeIngredientDatabase = {
  id: 2,
  recipe_id: 1,
  ingredient_id: 2,
  ingredient_name: "Cashews",
  quantity_unit: "cups",
  quantity_amount: 2
}

export const OatsIngredientDatabaseObjectWithId: RecipeIngredientDatabase = {
  id: 3,
  recipe_id: 1,
  ingredient_id: 3,
  ingredient_name: "Oats",
  quantity_unit: "cups",
  quantity_amount: 1
}

export const CoconutThreadIngredientDatabaseObjectWithId: RecipeIngredientDatabase = {
  id: 4,
  recipe_id: 1,
  ingredient_id: 4,
  ingredient_name: "Coconut Thread",
  quantity_unit: "cups",
  quantity_amount: 0.75
}