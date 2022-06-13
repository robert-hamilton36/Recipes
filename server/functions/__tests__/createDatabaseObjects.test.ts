import {
  createIngredientDatabaseObject,
  createRecipeDatabaseObject,
  createRecipeIngredientDatabaseObject,
  createUserDatabaseObject,
  createUserRecipeJoinDatabaseObject,
} from "../createDatabaseObjects"

import {
  HashedPasswordData,
  AnakinRegisterData,
} from "../../testing/mockdata/JSONUser"
import {
  IncomingAnakinDatabaseObject,
  IncomingAnakinEditDatabaseObject,
  IncomingAnakinNoPasswordDatabaseObject,
} from "../../testing/mockdata/userDatabaseObject"
import {
  CaramelSliceJSONRecipe,
  dateIngredient,
} from "../../testing/mockdata/JSONRecipe"
import {
  CaramelSliceDatabaseObject,
  DateIngredientDatabaseObject,
} from "../../testing/mockdata/recipeDatabaseObject"

describe("createUserDatabaseObject()", () => {
  test("creates a userDatabaseObject with all properties included", () => {
    const result = createUserDatabaseObject(
      AnakinRegisterData,
      HashedPasswordData
    )

    expect(result).toEqual(IncomingAnakinDatabaseObject)
  })

  test("creates a userDatabaseObject with no password", () => {
    const result = createUserDatabaseObject(AnakinRegisterData)

    expect(result).toEqual(IncomingAnakinNoPasswordDatabaseObject)
  })

  test("creates a userDatabaseObject with only a lastName", () => {
    const result = createUserDatabaseObject({
      lastName: "Skywalker-Amidala",
    })

    expect(result).toEqual(IncomingAnakinEditDatabaseObject)
  })
})

describe("createUserRecipeJoinDatabaseObject()", () => {
  test("creates a UserRecipeJoinDatabaseObject", () => {
    const result = createUserRecipeJoinDatabaseObject(1, 2)

    expect(result).toEqual({
      user_id: 1,
      recipe_id: 2,
    })
  })
})

describe("createRecipeDatabaseObject()", () => {
  test("creates a recipeDatabaseObject", () => {
    const result = createRecipeDatabaseObject(CaramelSliceJSONRecipe)

    expect(result).toEqual(CaramelSliceDatabaseObject)
  })

  test("creates a partial recipeDatabaseObject with name and cook time", () => {
    const result = createRecipeDatabaseObject({
      name: "Caramel Slice",
      cookingTime: { quantity: 50, unit: "mins" },
    })

    expect(result).toEqual({
      name: "Caramel Slice",
      cook_time_quantity: 50,
      cook_time_unit: "mins",
    })
  })
})

describe("createRecipeIngredientDatabaseObject()", () => {
  test("creates a recipeIngredientDatabaseObject", () => {
    const result = createRecipeIngredientDatabaseObject(dateIngredient, 1, 1)

    expect(result).toEqual(DateIngredientDatabaseObject)
  })

  test("creates a partial recipeIngredientDatabaseObject with recipeId and qauntity", () => {
    const result = createRecipeIngredientDatabaseObject(
      { quantity: { quantity: 5, unit: "cups" } },
      3
    )

    expect(result).toEqual({
      recipe_id: 3,
      quantity_amount: 5,
      quantity_unit: "cups",
    })
  })

  test("creates a partial recipeIngredientDatabaseObject with ingredientId and qauntity", () => {
    const result = createRecipeIngredientDatabaseObject(
      { quantity: { quantity: 5, unit: "cups" } },
      undefined,
      3
    )

    expect(result).toEqual({
      ingredient_id: 3,
      quantity_amount: 5,
      quantity_unit: "cups",
    })
  })

  test("creates a partial recipeIngredientDatabaseObject when incoming json contains ingredient id", () => {
    const result = createRecipeIngredientDatabaseObject({
      ingredientId: 4,
      quantity: { quantity: 5, unit: "cups" },
    })

    expect(result).toEqual({
      ingredient_id: 4,
      quantity_amount: 5,
      quantity_unit: "cups",
    })
  })

  test("creates a partial recipeIngredientDatabaseObject when incoming json contains ingredient id and as an argument", () => {
    const result = createRecipeIngredientDatabaseObject(
      { ingredientId: 4, quantity: { quantity: 5, unit: "cups" } },
      undefined,
      3
    )

    expect(result).toEqual({
      ingredient_id: 4,
      quantity_amount: 5,
      quantity_unit: "cups",
    })
  })
})

describe("createIngredientDatabaseObject()", () => {
  test("creates an ingredientDatabaseObject", () => {
    const result = createIngredientDatabaseObject("Dates")

    expect(result).toEqual({
      name: "Dates",
    })
  })
})
