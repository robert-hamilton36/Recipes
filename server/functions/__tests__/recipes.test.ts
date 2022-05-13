import { addRecipeToDatabase, testAddIngredientToDatabase } from "../recipes"

import { addNewIngredient, getIngredientIdByName } from "../../db/functions/ingredients"
import { addNewRecipeIngredient } from "../../db/functions/recipeIngredients"
import { addNewRecipe } from "../../db/functions/recipes"
import { addNewUserRecipe } from "../../db/functions/userRecipes"

import { createRecipeIngredientDatabaseObject, parseJSONRecipeToPartialRecipeDatabaseObject } from "../../utility/cleanJSONRecipeToDatabaseObjects"
import { CaramelSliceDatabaseObject, DateIngredientDatabaseObject } from "../../testing/mockdata/recipeDatabaseObject"
import { CaramelSliceJSONRecipe, dateIngredient, dateIngredientWithId } from "../../testing/mockdata/JSONRecipe"

jest.mock("../../db/functions/ingredients")
jest.mock("../../db/functions/recipeIngredients")
jest.mock("../../db/functions/recipes")
jest.mock("../../db/functions/userRecipes")

jest.mock("../../utility/cleanJSONRecipeToDatabaseObjects")

const MockGetIngredientIdByName = getIngredientIdByName as jest.Mock
const MockAddNewIngredient = addNewIngredient as jest.Mock
const MockAddNewRecipeIngredient = addNewRecipeIngredient as jest.Mock
const MockCreateRecipeIngredientDatabaseObject = createRecipeIngredientDatabaseObject as jest.Mock

const MockParseJSONRecipeToPartialRecipeDatabaseObject = parseJSONRecipeToPartialRecipeDatabaseObject as jest.Mock
const MockAddNewRecipe = addNewRecipe as jest.Mock
const MockAddNewUserRecipe = addNewUserRecipe as jest.Mock


describe('__addIngredientToDatabase()', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  // two tests for ingredient without an id

  it('gets the ingredients id number from db and creates a new recipeIngredient join', async () => {
    // if the ingredient already exists, but for some reason was sent over with out its id number
    // this should check that it exists first and gets its id number
    MockGetIngredientIdByName.mockResolvedValueOnce(1)
    MockCreateRecipeIngredientDatabaseObject.mockReturnValueOnce(DateIngredientDatabaseObject)
    MockAddNewRecipeIngredient.mockResolvedValueOnce(1)

    const result = await testAddIngredientToDatabase(dateIngredient, 1)

    expect(MockGetIngredientIdByName).toHaveBeenCalledTimes(1)
    expect(MockAddNewIngredient).toHaveBeenCalledTimes(0)
    expect(MockCreateRecipeIngredientDatabaseObject).toHaveBeenCalledTimes(1)
    expect(MockAddNewRecipeIngredient).toHaveBeenCalledTimes(1)
    expect(result).toBeUndefined()
  })

  it('creates an new ingredient in the database before creating a new recipeIngredient join', async () => {
    // this checks whether the ingredient exists; it doesn't
    // it then adds the new ingredient
    MockGetIngredientIdByName.mockResolvedValueOnce(null)
    MockAddNewIngredient.mockResolvedValueOnce(1)
    MockCreateRecipeIngredientDatabaseObject.mockReturnValueOnce(DateIngredientDatabaseObject)
    MockAddNewRecipeIngredient.mockResolvedValueOnce(1)

    const result = await testAddIngredientToDatabase(dateIngredient, 1)

    expect(MockGetIngredientIdByName).toHaveBeenCalledTimes(1)
    expect(MockAddNewIngredient).toHaveBeenCalledTimes(1)
    expect(MockCreateRecipeIngredientDatabaseObject).toHaveBeenCalledTimes(1)
    expect(MockAddNewRecipeIngredient).toHaveBeenCalledTimes(1)
    expect(result).toBeUndefined()
  })

  // tests for ingredient with id number

  it('adds a new recipeIngredient join', async () => {
    // ingredientId exists so it skips GetIngredientIdByName and AddNewIngredient
    MockCreateRecipeIngredientDatabaseObject.mockReturnValueOnce(DateIngredientDatabaseObject)
    MockAddNewRecipeIngredient.mockResolvedValueOnce(1)

    const result = await testAddIngredientToDatabase(dateIngredientWithId, 1)

    expect(MockGetIngredientIdByName).toHaveBeenCalledTimes(0)
    expect(MockAddNewIngredient).toHaveBeenCalledTimes(0)
    expect(MockCreateRecipeIngredientDatabaseObject).toHaveBeenCalledTimes(1)
    expect(MockAddNewRecipeIngredient).toHaveBeenCalledTimes(1)
    expect(result).toBeUndefined()
  })
})

describe('addRecipeToDatabase()', () => {
  // todo mock __addIngredientToDatabase
  it('no empty file', async () => {
    MockParseJSONRecipeToPartialRecipeDatabaseObject.mockReturnValueOnce(CaramelSliceDatabaseObject)
    MockAddNewRecipe.mockResolvedValueOnce(1)
    MockAddNewUserRecipe.mockResolvedValueOnce(1)

    const result = await addRecipeToDatabase(CaramelSliceJSONRecipe, 1)

    expect(MockParseJSONRecipeToPartialRecipeDatabaseObject).toHaveBeenCalledTimes(1)
    expect(MockAddNewRecipe).toHaveBeenCalledTimes(1)
    expect(MockAddNewUserRecipe).toHaveBeenCalledTimes(1)
    expect(result).toBeUndefined()
  })
})