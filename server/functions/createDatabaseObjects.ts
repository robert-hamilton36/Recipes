import { IngredientsDatabase, RecipeDatabase, RecipeIngredientDatabase, UserDatabase } from "../types/DatabaseObjects"
import { IncomingJSONRecipe, Ingredient } from "../types/JSONRecipe"
import { IncomingUser } from "../types/User"

export const createUserDatabaseObject = ({ firstName, lastName, email }: Partial<IncomingUser>, passwordHash?:string): Partial<UserDatabase> => {
  const returnObj: Partial<UserDatabase> = {}
  
  if (firstName) returnObj.first_name = firstName
  if (lastName) returnObj.last_name = lastName
  if (email) returnObj.email = email
  if (passwordHash) returnObj.password_hash = passwordHash
  return returnObj
}

export const createUserRecipeJoinDatabaseObject = (userId: number, recipeId: number) => {
  return {
    user_id: userId,
    recipe_id: recipeId
  }
}

export const createRecipeDatabaseObject = (jsonRecipe: IncomingJSONRecipe): Partial<RecipeDatabase> => {
  return {
    name: jsonRecipe.name,
    cook_time_quantity: jsonRecipe.cookingTime.quantity,
    cook_time_unit: jsonRecipe.cookingTime.unit,
    prep_time_quantity: jsonRecipe.prepTime.quantity,
    prep_time_unit: jsonRecipe.prepTime.unit,
    instructions: JSON.stringify(jsonRecipe.instructions),
    notes: jsonRecipe.notes
  }
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

export const createIngredientDatabaseObject = (ingredientName: string): Partial<IngredientsDatabase> => {
  return {
    name: ingredientName
  }
}
