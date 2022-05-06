import connection from '../connection'
import { RecipeIngredientDatabase } from '../../types/DatabaseObjects'
import { DeletionDBError, GetDBError, UpdateDBError } from '../../errors/crudDBErrors'

export function addNewRecipeIngredient (recipe: Partial<RecipeIngredientDatabase>, db = connection): Promise<number> {
  console.log(recipe)
  return db('recipeIngredients').insert(recipe).then(id => id[0])
}

export function getRecipeIngredientsByRecipeId (recipeId: number, db = connection): Promise<RecipeIngredientDatabase[]> {
  return db('recipeIngredients')
    .select()
    .where('recipeId', recipeId)
    .then(recipeIngredients => {
      if(recipeIngredients.length === 0) {
        throw new GetDBError('recipeIngredients', recipeId)
      }
      return recipeIngredients
    })
}

export function updateRecipeIngredient (recipeIngredientsId: number, updatedRecipe: RecipeIngredientDatabase, db = connection):  Promise<number> {
  return db('recipeIngredients')
    .where('recipeIngredientsId', recipeIngredientsId)
    .update(updatedRecipe)
    .then(rowsUpdated => {
      console.log(rowsUpdated)
      if(rowsUpdated) {
        return rowsUpdated
      } else {
        throw new UpdateDBError('recipeIngredient', recipeIngredientsId)
      }
    })
}

export function deleteRecipeIngredientsByRecipeId (recipeId: number, db = connection): Promise<number> {
  return db('recipeIngredients')
    .where('recipeId', recipeId)
    .del()
    .then(rowsDeleted => {
      console.log(rowsDeleted)
      if(rowsDeleted) {
        return rowsDeleted
      } else {
        throw new DeletionDBError()
      }
    })
}