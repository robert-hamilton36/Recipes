import { CaramelSliceJSONRecipeWithIds, dateIngredientWithId } from "../../testing/mockdata/JSONRecipe"
import { CaramelSliceDatabaseObjectWithId, CashewsIngredientDatabaseObjectWithId, CoconutThreadIngredientDatabaseObjectWithId, DateIngredientDatabaseObjectWithId, OatsIngredientDatabaseObjectWithId } from "../../testing/mockdata/recipeDatabaseObject"
import { createRecipeJSONObject, FORTESTINGCreateIngredientObject } from "../createJsonObjects"

describe('createIngredientObject()', () => {
  test('creates a json ingredient object', () => {
    const result = FORTESTINGCreateIngredientObject(DateIngredientDatabaseObjectWithId)
    expect(result).toEqual(dateIngredientWithId)
  })
})

describe('createRecipeJSONObject()', () => {
  test('creates a json recipe object', () => {
    const result = createRecipeJSONObject(CaramelSliceDatabaseObjectWithId, [DateIngredientDatabaseObjectWithId, CashewsIngredientDatabaseObjectWithId, OatsIngredientDatabaseObjectWithId, CoconutThreadIngredientDatabaseObjectWithId])
    expect(result).toEqual(CaramelSliceJSONRecipeWithIds)
  })
})