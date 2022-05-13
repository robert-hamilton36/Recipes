import { addNewIngredient, getIngredientIdByName } from "../db/functions/ingredients";
import { addNewRecipeIngredient } from "../db/functions/recipeIngredients";
import { addNewRecipe } from "../db/functions/recipes";
import { addNewUserRecipe } from "../db/functions/userRecipes";

import { createRecipeIngredientDatabaseObject, parseJSONRecipeToPartialRecipeDatabaseObject } from "../utility/cleanJSONRecipeToDatabaseObjects";

import { IncomingJSONRecipe, Ingredient } from "../types/JSONRecipe";

const __addIngredientToDatabase = async (ingredient: Ingredient, recipeId: number) => {
  let ingredientId
  // if incoming data contains ingredientId
  if (ingredient.ingredientId){
    ingredientId = ingredient.ingredientId
  } else {
    // all incoming ingredients that already exist should have an id
    // just in case for some reason the ingredient exists but it gets sent without an id
    // this will get it's id
    ingredientId = await getIngredientIdByName(ingredient.ingredient)
  }

  if(!ingredientId) {
    // if the id doesn't exist then we need to add the new ingredient into the database
    ingredientId = await addNewIngredient({ name: ingredient.ingredient})
  }
  
  // create partial RecipeIngredient join
  const recipeIngredient = createRecipeIngredientDatabaseObject(ingredient, recipeId, ingredientId)

  // add RecipeIngredient to database
  await addNewRecipeIngredient(recipeIngredient)
  
  return
}

export const addRecipeToDatabase = async (jsonRecipe: IncomingJSONRecipe, userId: number) => {
  const ingredients = jsonRecipe.ingredients
  const recipe = parseJSONRecipeToPartialRecipeDatabaseObject(jsonRecipe)

  // add recipe to database
  const recipeId = await addNewRecipe(recipe)
 
  // exit with error if no recipeId
  // this was a handle for knex error
  // currently is assumed to always work
  // if (!recipeId) throw('No recipe id')

  // add userRecipe Join to database
  const userRecipeId = await addNewUserRecipe({userId, recipeId})
  
  // add ingredients to database
  ingredients.forEach((ingredient) => {
    __addIngredientToDatabase(ingredient, userId)
   
  })

  return userRecipeId
}

// export for testing purposes
export const testAddIngredientToDatabase = __addIngredientToDatabase
