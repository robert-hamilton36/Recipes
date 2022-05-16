import { Knex } from 'knex'

import connection from '../connection'

import { addItemToDatabase, getIdByUniqueProperty } from './basicCrud'
import { createRecipeIngredientDatabaseObject } from '../../utility/cleanJSONRecipeToDatabaseObjects'
import { Ingredient } from '../../../types/JSONRecipe'
import { RecipeDatabase, UserRecipeDatabase } from '../../../types/DatabaseObjects'

const db = connection

interface KnexError extends Error{
  code: string;
  errno: number;
}

const isUniqueConstraintError = (e: Error) => {
  const error = e as KnexError
  if (error?.errno === 23505 || error?.errno === 19) {
    console.log('is true')
    return true
  }
}

const __getIngredientId = async (ingredient: Ingredient, trx: Knex.Transaction) => {
  let ingredientId: number
  const name = ingredient.ingredient

  if (ingredient.ingredientId) {
    // if ingredient exists it should come with its id
    ingredientId = ingredient.ingredientId
  } else {
    try {
      // if no ingredientId technically it shouldn't exist, add it to db
      ingredientId = await addItemToDatabase('ingredients', {name}, trx)
    } catch (e: unknown) {
      // this is a catch for a unique constraint error, which shouldn't happen
      // but would occur when for some reason an ingredient that exists and has an id is passed into here without an id
      if (e instanceof Error && isUniqueConstraintError(e)) {
        console.log('unique caught')
        ingredientId = await getIdByUniqueProperty('ingredients', { name }, trx)
        console.log(ingredientId)
      } else {
        throw e
      }
    }
  }

  return ingredientId
}

const __addIngredientToDatabase = async (ingredient: Ingredient, recipeId: number, trx: Knex.Transaction) => {
  const ingredientId = await __getIngredientId(ingredient, trx)
  // create partial RecipeIngredientDatabaseObject
  const recipeIngredient = createRecipeIngredientDatabaseObject(ingredient, recipeId, ingredientId)

  // add RecipeIngredient to database
  await addItemToDatabase('recipe_ingredients', recipeIngredient, trx)
}

export async function addRecipe (recipe: Partial<RecipeDatabase>, ingredients: Ingredient[], user_id: number) {
  try {
    return await db.transaction( async (trx) => {
      // add recipe to recipe table
      const recipe_id = await addItemToDatabase('recipes', recipe, trx)
    
      // create and add user_recipe to table
      const userRecipe: Partial<UserRecipeDatabase> = { user_id, recipe_id }
      await addItemToDatabase('user_recipes', userRecipe, trx)

      for (const ingredient of ingredients) {
        // for each ingredient
        // if needed add ingredient and create ingredient_recipe join
        await __addIngredientToDatabase(ingredient, recipe_id, trx)
      }
      return recipe_id
    })
  }
  catch (e: unknown) {
    console.log(e)
  }
}
