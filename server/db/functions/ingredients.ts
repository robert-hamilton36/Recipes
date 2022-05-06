import connection from '../connection'
import { IngredientsDatabase } from '../../types/DatabaseObjects'
import { DeletionDBError, GetDBError } from '../../errors/crudDBErrors'

export function addNewIngredient (ingredient: Partial<IngredientsDatabase>, db = connection): Promise<number> {
  return db('ingredients').insert(ingredient).then(id => id[0])
}

export function getIngredientById (ingredientId: number, db = connection): Promise<IngredientsDatabase[]> {
  return db('ingredients')
    .select()
    .first()
    .where('ingredientId', ingredientId)
    .then(ingredient => {
      console.log(ingredient)
      if(ingredient) {
        return ingredient
      } else {
        throw new GetDBError('ingredient', ingredientId)
      }
    })
}

export function getIngredientByName (name: string, db = connection): Promise<IngredientsDatabase[]> {
  return db('ingredients')
    .select()
    .first()
    .where('name', name)
    .then(ingredient => {
      console.log(ingredient)
      if(ingredient) {
        return ingredient
      } else {
        throw new Error(`Get failed: Ingredient: ${name} not found`)
      }
    })
}

export function deleteIngredient (ingredientId: number, db = connection): Promise<number> {
  return db('ingredients')
  .where('ingredientId', ingredientId)
  .del()
  .then(rowsDeleted => {
    console.log(rowsDeleted)
    if(rowsDeleted) {
      return rowsDeleted
    } else {
      throw new DeletionDBError('ingredient', ingredientId)
    }
  })
}