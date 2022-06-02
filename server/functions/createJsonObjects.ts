import { RecipeDatabase, RecipeIngredientDatabase } from "../types/DatabaseObjects";
import { JSONIngredient, JSONRecipe } from "../types/JSONRecipe";


const createIngredientObject = (recipeIngredient: RecipeIngredientDatabase): JSONIngredient => {
  return {
    ingredientId: recipeIngredient.ingredient_id,
    ingredient: recipeIngredient.ingredient_name,
    quantity: {
      quantity: recipeIngredient.quantity_amount,
      unit: recipeIngredient.quantity_unit
    }
  }
}
export const createRecipeJSONObject = (recipeDatabaseObject: RecipeDatabase, recipeIngredients: RecipeIngredientDatabase[]): JSONRecipe=> {
  const ingredients = recipeIngredients.map((recipeIngredient) => createIngredientObject(recipeIngredient))
  return {
    recipeId: recipeDatabaseObject.id,
    name: recipeDatabaseObject.name,
    cookingTime: {
      quantity: recipeDatabaseObject.cook_time_quantity,
      unit: recipeDatabaseObject.cook_time_unit  
    },
    prepTime: {
      quantity: recipeDatabaseObject.prep_time_quantity,
      unit: recipeDatabaseObject.prep_time_unit
    },
    instructions: JSON.parse(recipeDatabaseObject.instructions),
    ingredients,
    notes: recipeDatabaseObject.notes
  }
}

export const FORTESTINGCreateIngredientObject = createIngredientObject