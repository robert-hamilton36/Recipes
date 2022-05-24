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

export const DateIngredientDatabaseObject:Partial<RecipeIngredientDatabase> = {
  recipe_id: 1,
  ingredient_id: 1,
  ingredient_name: "Dates",
  quantity_unit: "g",
  quantity_amount: 400
}