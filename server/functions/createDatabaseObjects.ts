import { IngredientsDatabase, RecipeDatabase, RecipeIngredientDatabase, UserDatabase, UserRecipeDatabase } from "../types/DatabaseObjects"
import { JSONRecipe, JSONIngredient } from "../types/JSONRecipe"
import { IncomingUser } from "../types/User"

export const createUserDatabaseObject = ({ firstName, lastName, email }: Partial<IncomingUser>, passwordHash?:string): Partial<UserDatabase> => {
  const returnObj: Partial<UserDatabase> = {}
  
  if (firstName) returnObj.first_name = firstName
  if (lastName) returnObj.last_name = lastName
  if (email) returnObj.email = email
  if (passwordHash) returnObj.password_hash = passwordHash

  return returnObj
}

export const createUserRecipeJoinDatabaseObject = (userId: number, recipeId: number): Partial<UserRecipeDatabase> => {
  return {
    user_id: userId,
    recipe_id: recipeId
  }
}

export const createRecipeDatabaseObject = (jsonRecipe: Partial<JSONRecipe>): Partial<RecipeDatabase> => {
  const returnObj: Partial<RecipeDatabase> = {}

  if(jsonRecipe.name) returnObj.name = jsonRecipe.name
  if(jsonRecipe?.cookingTime?.quantity) returnObj.cook_time_quantity = jsonRecipe.cookingTime.quantity
  if(jsonRecipe?.cookingTime?.unit) returnObj.cook_time_unit = jsonRecipe.cookingTime.unit
  if(jsonRecipe?.prepTime?.quantity) returnObj.prep_time_quantity = jsonRecipe.prepTime.quantity
  if(jsonRecipe?.prepTime?.unit) returnObj.prep_time_unit = jsonRecipe.prepTime.unit
  if(jsonRecipe?.instructions) returnObj.instructions = JSON.stringify(jsonRecipe.instructions)
  if(jsonRecipe?.notes) returnObj.notes = jsonRecipe.notes

  return returnObj
}

export const createRecipeIngredientDatabaseObject = (ingredient: Partial<JSONIngredient>, recipeId?: number, ingredientId?: number): Partial<RecipeIngredientDatabase> => {
  const returnObj: Partial<RecipeIngredientDatabase> = {}

  if(recipeId) returnObj.recipe_id = recipeId
  // when creating for first time ingredientId comes as an argument
  if(ingredientId) returnObj.ingredient_id = ingredientId
  // when its already been created it is already in ingredients
  if(ingredient.ingredientId) returnObj.ingredient_id = ingredient.ingredientId

  if(ingredient.ingredient) returnObj.ingredient_name = ingredient.ingredient
  if(ingredient?.quantity?.quantity) returnObj.quantity_amount = ingredient.quantity.quantity
  if(ingredient?.quantity?.unit) returnObj.quantity_unit = ingredient.quantity.unit

  return returnObj
}

export const createIngredientDatabaseObject = (ingredientName: string): Partial<IngredientsDatabase> => {
  return {
    name: ingredientName
  }
}
