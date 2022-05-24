import { createIngredientDatabaseObject, createRecipeDatabaseObject, createRecipeIngredientDatabaseObject, createUserDatabaseObject, createUserRecipeJoinDatabaseObject } from "../createDatabaseObjects"

import { HashedPasswordData, AnakinRegisterData } from "../../testing/mockdata/JSONUser"
import { IncomingAnakinDatabaseObject, IncomingAnakinEditDatabaseObject, IncomingAnakinNoPasswordDatabaseObject } from "../../testing/mockdata/userDatabaseObject"
import { CaramelSliceJSONRecipe, dateIngredient } from "../../testing/mockdata/JSONRecipe"
import { CaramelSliceDatabaseObject, DateIngredientDatabaseObject } from "../../testing/mockdata/recipeDatabaseObject"

describe('createUserDatabaseObject()', () => {
  test('creates a userDatabaseObject with all properties included', () => {
    const result = createUserDatabaseObject(AnakinRegisterData, HashedPasswordData)

    expect(result).toEqual(IncomingAnakinDatabaseObject)
  })

  test('creates a userDatabaseObject with no password', () => {
    const result = createUserDatabaseObject(AnakinRegisterData)

    expect(result).toEqual(IncomingAnakinNoPasswordDatabaseObject)
  })

  test('creates a userDatabaseObject with only a lastName', () => {
    const result = createUserDatabaseObject({
      lastName: 'Skywalker-Amidala',
    })

    expect(result).toEqual(IncomingAnakinEditDatabaseObject)
  })
})

describe('createUserRecipeJoinDatabaseObject()', () => {
  test('creates a UserRecipeJoinDatabaseObject', () => {
    const result = createUserRecipeJoinDatabaseObject(1, 2)

    expect(result).toEqual({
      user_id: 1,
      recipe_id: 2
    })
  })
})

describe('createRecipeDatabaseObject()', () => {
  test('creates a recipeDatabaseObject', () => {
    const result = createRecipeDatabaseObject(CaramelSliceJSONRecipe)

    expect(result).toEqual(CaramelSliceDatabaseObject)
  })
})

describe('createRecipeIngredientDatabaseObject()', () => {
  test('creates a recipeIngredientDatabaseObject', () => {
    const result = createRecipeIngredientDatabaseObject(dateIngredient, 1, 1)

    expect(result).toEqual(DateIngredientDatabaseObject)
  })
})

describe('createIngredientDatabaseObject()', () => {
  test('creates an ingredientDatabaseObject', () => {
    const result = createIngredientDatabaseObject('Dates')

    expect(result).toEqual({
      name: 'Dates'
    })
  })
})