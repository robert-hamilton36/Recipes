import { Knex } from 'knex'

import connection from '../connection'

import { addItemToDatabase, deleteItemBySelector, getFirstItemBySelector, getIdByUniqueProperty, getItemsBySelector, updateItemBySelector } from './basicCrud'

import { RecipeDatabase, UserRecipeDatabase } from '../../types/DatabaseObjects'
import { createRecipeDatabaseObject, createRecipeIngredientDatabaseObject } from '../../functions/createDatabaseObjects'
import { JSONIngredient, JSONRecipe } from '../../types/JSONRecipe'
import { isUniqueConstraintError } from '../../functions/errorHandlers'
import { createRecipeJSONObject } from '../../functions/createJsonObjects'
import { DeletionDBError, UpdateDBError } from './crudDBErrors'


const db = connection

const __getIngredientId = async (ingredient: JSONIngredient, trx: Knex.Transaction) => {
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
      if (isUniqueConstraintError(e)) {
        ingredientId = await getIdByUniqueProperty('ingredients', { name }, trx)
      } else {
        throw e
      }
    }
  }

  return ingredientId
}

const __addIngredientToDatabase = async (ingredient: JSONIngredient, recipeId: number, trx: Knex.Transaction) => {
  const ingredientId = await __getIngredientId(ingredient, trx)
  // create partial RecipeIngredientDatabaseObject
  const recipeIngredient = createRecipeIngredientDatabaseObject(ingredient, recipeId, ingredientId)

  // add RecipeIngredient to database
  await addItemToDatabase('recipe_ingredients', recipeIngredient, trx)
}

export async function addRecipe (recipe: Partial<RecipeDatabase>, ingredients: JSONIngredient[], user_id: number) {
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
    // log error
    throw new Error('Transaction failed')
  }
}

// function that calls this should catch errors
export async function getRecipeById (id: number) {
  // get recipe
  const recipe = await getFirstItemBySelector('recipes', { id })

  // get all recipeIngredients for above recipe
  const recipeIngredients = await getItemsBySelector('recipe_ingredients', {'recipe_id': id})

  // combine the ingredients and recipe to create JSON and return
  return  createRecipeJSONObject(recipe, recipeIngredients)
}

// function that calls this should catch errors
export async function getUsersRecipesByUserId (id: number) {
  const userRecipes = await getItemsBySelector('user_recipes', { user_id: id })
  return Promise.all(userRecipes.map((userRecipe) => {
    return getRecipeById(userRecipe.recipe_id)

  }))
}

export async function updateRecipe (incomingRecipe: Partial<JSONRecipe>) {
  const { ingredients, ...recipeToEdit } = incomingRecipe
  try {
    return await db.transaction ( async (trx) => {
      // if there are edited ingredients update them
      if (ingredients) {
        const editedIngredients = ingredients.map((ingredient) => createRecipeIngredientDatabaseObject(ingredient))
        for (const ingredient of editedIngredients) {
          if (ingredient.id === undefined) throw new Error('No Id')
          const id = ingredient.id
          await updateItemBySelector('recipe_ingredients', { id }, ingredient, trx)
        }
      }
      // if it edits the recipe update it
      if (recipeToEdit) {
        if (recipeToEdit.recipeId === undefined) throw new Error('No Id')
        const id = recipeToEdit.recipeId
        const editedRecipe = createRecipeDatabaseObject(recipeToEdit)
        await updateItemBySelector('recipes', { id }, editedRecipe, trx)
      }
      return 1
    })
  } catch (e: unknown) {
    // log error
    throw new UpdateDBError()
  }
}

export async function deleteAllTraceOfRecipe (recipe_id: number) {
  try {
    return await db.transaction( async (trx) => {
      await deleteItemBySelector('user_recipes', { recipe_id }, trx)
      await deleteItemBySelector('recipes', { id: recipe_id }, trx)
      await deleteItemBySelector('recipe_ingredients', { recipe_id }, trx)
      // potentially delete all ingredients only used by this recipe
    })
  } catch(e: unknown) {
    // log error
    throw new DeletionDBError()
  }
}