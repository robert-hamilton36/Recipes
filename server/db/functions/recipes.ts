import connection from '../connection'
import { RecipeDatabase } from '../../types/DatabaseObjects'
import { DeletionDBError, GetDBError, UpdateDBError } from '../../errors/crudDBErrors'

const db = connection

export function addNewRecipe (recipe: Partial<RecipeDatabase>): Promise<number> {
  return db('recipes').insert(recipe).then(id => id[0])
}

export function getRecipeByRecipeId (recipeId: number): Promise<RecipeDatabase> {
  return db('recipes')
    .select()
    .where('recipeId', recipeId)
    .first()
    .then(recipe => {
      if(!recipe) {
        throw new GetDBError('recipes', recipeId)
      }
      return recipe
    })
}

export function updateRecipe (recipeId: number, updatedRecipe: RecipeDatabase):  Promise<number> {
  return db('recipes')
    .where('recipeId', recipeId)
    .update(updatedRecipe)
    .then(rowsUpdated => {
      if(rowsUpdated) {
        return rowsUpdated
      } else {
        throw new UpdateDBError('recipes', recipeId)
      }
    })
}

export function deleteRecipe (recipeId: number): Promise<number> {
  return db('recipes')
    .where('recipeId', recipeId)
    .del()
    .then(rowsDeleted => {
      if(rowsDeleted) {
        return rowsDeleted
      } else {
        throw new DeletionDBError('recipes', recipeId)
      }
    })
}