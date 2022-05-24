import connection from '../connection'
import { DeletionDBError, GetDBError } from './crudDBErrors'
import { IngredientsDatabase, RecipeDatabase, RecipeIngredientDatabase, UserRecipeDatabase } from '../../types/DatabaseObjects'

type Table =  'ingredients' | 'recipe_ingredients' | 'recipes' | 'user_recipes' | 'users'
type Item = Partial<IngredientsDatabase | RecipeIngredientDatabase | RecipeDatabase | UserRecipeDatabase>

interface Selector {
  // as in { 'userId': userId }
  [x: string]: number | string
}

export function addItemToDatabase (table: Table, item: Item, db = connection): Promise<number> {
  return db(table)
    .insert(item)
    .then(id => id[0])
}

export function getItemsBySelector (table: Table, selector: Selector, db = connection) {
  return db(table)
    .select()
    .where(selector)
    .then((results) => {
      if(results.length === 0) {
        throw new GetDBError(table)
      }
      return results
    })
}

export function getFirstItemBySelector (table: Table, selector: Selector, db = connection) {
  return db(table)
    .select()
    .where(selector)
    .first()
    .then((result) => {
      if(result) {
        return result
      } else {
        throw new GetDBError(table)
      }
    })
}

export function getIdByUniqueProperty (table: Table, property: Selector, db = connection) {
  return db(table)
    .select()
    .where(property)
    .first()
    .then((result: Item | undefined) => {
      if(result?.id) {
        return result.id
      } else {
        throw new GetDBError(table)
      }
    })
}

export function deleteItemBySelector (table: Table, selector: Selector, db = connection) {
  return db(table)
    .where(selector)
    .del()
    .then(rowsDeleted => {
      if(rowsDeleted) {
        return rowsDeleted
      } else {
        throw new DeletionDBError(table)
      }
    })
}