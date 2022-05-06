import connection from '../connection'
import { UserRecipeDatabase } from '../../types/DatabaseObjects'
import { DeletionDBError, GetDBError } from '../../errors/crudDBErrors'

export function addNewUserRecipe (newUsersRecipe: Partial<UserRecipeDatabase>, db = connection): Promise<number> {
  return db('userRecipes').insert(newUsersRecipe).then(id => id[0])
}

export function getAllUserRecipesByUserId (userId: number, db = connection): Promise<UserRecipeDatabase[]> {
  return db('userRecipes')
    .select()
    .where('userId', userId)
    .then(recipeIngredients => {
      if(recipeIngredients.length === 0) {
        throw new GetDBError('userRecipes', userId)
      }
      return recipeIngredients
    })
}


export function deleteUserRecipeJoin (usersRecipeId: number, db = connection): Promise<number> {
  return db('userRecipes') 
    .where('userRecipesId', usersRecipeId)
    .del()
    .then(rowsDeleted => {
      if(rowsDeleted) {
        return rowsDeleted
      } else {
        throw new DeletionDBError('userRecipes', usersRecipeId)
      }
    })
}