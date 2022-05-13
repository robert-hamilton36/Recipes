import { RecipeDatabase, RecipeIngredientDatabase } from "../types/DatabaseObjects"
import { IncomingJSONRecipe, Ingredient } from "../types/JSONRecipe"

export const parseJSONRecipeToPartialRecipeDatabaseObject = (jsonRecipe: IncomingJSONRecipe) => {
  const recipe: Partial<RecipeDatabase> = {
    name: jsonRecipe.name,
    cookTimeQuantity: jsonRecipe.cookingTime.quantity,
    cookTimeUnit: jsonRecipe.cookingTime.unit,
    prepTimeQuantity: jsonRecipe.prepTime.quantity,
    prepTimeUnit: jsonRecipe.prepTime.unit,
    instructions: JSON.stringify(jsonRecipe.instructions),
    notes: jsonRecipe.notes
  }

  return recipe
}

export const createRecipeIngredientDatabaseObject = (ingredient: Ingredient, recipeId: number, ingredientId: number): Partial<RecipeIngredientDatabase> => {
  return {
    recipeId,
    ingredientId,
    ingredientName: ingredient.ingredient,
    quantityAmount: ingredient.quantity.quantity,
    quantityUnit: ingredient.quantity.unit,
  }
}
