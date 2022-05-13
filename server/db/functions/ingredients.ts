import connection from '../connection'
import { IngredientsDatabase } from '../../types/DatabaseObjects'
import { DeletionDBError, GetDBError } from '../../errors/crudDBErrors'

const db = connection

export function addNewIngredient (ingredient: Partial<IngredientsDatabase>): Promise<number> {
  return db('ingredients').insert(ingredient).then(id => id[0])
  //?todo custom catch error here??
}

export function getIngredientById (ingredientId: number): Promise<IngredientsDatabase> {
  return db('ingredients')
    .select()
    .first()
    .where('ingredientId', ingredientId)
    .then(ingredient => {
      if(ingredient) {
        return ingredient
      } else {
        throw new GetDBError('ingredient', ingredientId)
      }
    })
}

export function getIngredientByName (name: string): Promise<IngredientsDatabase> {
  return db('ingredients')
    .select()
    .first()
    .where('name', name)
    .then(ingredient => {
      if(ingredient) {
        return ingredient
      } else {
        throw new Error(`Get failed: Ingredient: ${name} not found`)
      }
    })
}

export function getIngredientIdByName (name: string): Promise<number> {
  return db('ingredients')
    .select()
    .first()
    .where('name', name)
    .then(ingredient => {
      if(ingredient) {
        return ingredient.ingredientId
      } else {
        return null
      }
    })
    .catch(() => null)
}

export function deleteIngredient (ingredientId: number): Promise<number> {
  return db('ingredients')
  .where('ingredientId', ingredientId)
  .del()
  .then(rowsDeleted => {
    if(rowsDeleted) {
      return rowsDeleted
    } else {
      throw new DeletionDBError('ingredient', ingredientId)
    }
  })
}