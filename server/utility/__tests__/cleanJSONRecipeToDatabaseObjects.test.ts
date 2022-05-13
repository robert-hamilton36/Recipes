import { CaramelSliceJSONRecipe } from "../../testing/mockdata/JSONRecipe"
import { CaramelSliceDatabaseObject, DateIngredientDatabaseObject } from "../../testing/mockdata/recipeDatabaseObject"
import { createRecipeIngredientDatabaseObject, parseJSONRecipeToPartialRecipeDatabaseObject } from "../cleanJSONRecipeToDatabaseObjects"

describe('parseJSONRecipeToPartialRecipeDatabaseObject()', () => {
  test('it changes the JSON format into the database format', () => {
    const parsedRecipeObject = parseJSONRecipeToPartialRecipeDatabaseObject(CaramelSliceJSONRecipe)

    expect(parsedRecipeObject).toEqual(CaramelSliceDatabaseObject)
  })
})

describe('createRecipeIngredientDatabaseObject()', () => {
  test('it creates the correct object', () => {
    const parsedRecipeObject = createRecipeIngredientDatabaseObject(CaramelSliceJSONRecipe.ingredients[0], 1, 1)

    expect(parsedRecipeObject).toEqual(DateIngredientDatabaseObject)
  })
})