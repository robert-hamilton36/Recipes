import { RecipeDatabase, RecipeIngredientDatabase } from "../types/DatabaseObjects"
import { IncomingJSONRecipe, Ingredient } from "../types/JSONRecipe"

export const parseJSONRecipeToPartialRecipeDatabaseObject = (jsonRecipe: IncomingJSONRecipe) => {
  const recipe: Partial<RecipeDatabase> = {
    name: jsonRecipe.name,
    cook_time_quantity: jsonRecipe.cookingTime.quantity,
    cook_time_unit: jsonRecipe.cookingTime.unit,
    prep_time_quantity: jsonRecipe.prepTime.quantity,
    prep_time_unit: jsonRecipe.prepTime.unit,
    instructions: JSON.stringify(jsonRecipe.instructions),
    notes: jsonRecipe.notes
  }

  return recipe
}

export const createRecipeIngredientDatabaseObject = (ingredient: Ingredient, recipeId: number, ingredientId: number): Partial<RecipeIngredientDatabase> => {
  return {
    recipe_id: recipeId,
    ingredient_id: ingredientId,
    ingredient_name: ingredient.ingredient,
    quantity_amount: ingredient.quantity.quantity,
    quantity_unit: ingredient.quantity.unit,
  }
}
