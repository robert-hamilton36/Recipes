import request from "supertest"

import recipeRouter from "../recipe"

import { testServerForRoute } from "../../testing/server.mock"
import {
  CaramelSliceJSONRecipe,
  CaramelSliceJSONRecipeWithIds,
} from "../../testing/mockdata/JSONRecipe"
import {
  DeletionDBError,
  GetDBError,
  UpdateDBError,
} from "../../db/functions/crudDBErrors"

//__________________________________________ functions to mock __________________________________________________
import {
  addRecipe,
  getRecipeById,
  getUsersRecipesByUserId,
  updateRecipe,
  userSavesRecipe,
} from "../../db/functions/recipe"
import { deleteItemBySelector } from "../../db/functions/basicCrud"

jest.mock("../../db/functions/recipe")
jest.mock("../../db/functions/basicCrud")

const MockedAddRecipe = addRecipe as jest.Mock
const MockedUserSavesRecipe = userSavesRecipe as jest.Mock
const MockedGetUsersRecipesByUserId = getUsersRecipesByUserId as jest.Mock
const MockedGetRecipeById = getRecipeById as jest.Mock
const MockedUpdateRecipe = updateRecipe as jest.Mock
const MockedDeleteItemBySelector = deleteItemBySelector as jest.Mock

//___________________________________________ end function mocks _________________________________________________

const mockedServer = testServerForRoute(recipeRouter)

describe("POST /add", () => {
  describe("valid request data", () => {
    beforeAll(() => {
      MockedAddRecipe.mockResolvedValue(1)
      MockedUserSavesRecipe.mockResolvedValue(1)
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    test("Functions are called correctly", async () => {
      await request(mockedServer)
        .post("/add")
        .send({ userId: 1, recipe: CaramelSliceJSONRecipe })
      expect(MockedAddRecipe).toHaveBeenCalledTimes(1)
      expect(MockedAddRecipe.mock.calls[0][0]).toEqual(CaramelSliceJSONRecipe)
      expect(MockedUserSavesRecipe).toHaveBeenCalledTimes(1)
      expect(MockedUserSavesRecipe.mock.calls[0][0]).toBe(1)
      expect(MockedUserSavesRecipe.mock.calls[0][1]).toBe(1)
    })

    test("returns status code 200", async () => {
      const response = await request(mockedServer)
        .post("/add")
        .send({ userId: 1, recipe: CaramelSliceJSONRecipe })
      expect(response.statusCode).toBe(201)
    })

    test("header specifies content type json", async () => {
      const response = await request(mockedServer)
        .post("/add")
        .send({ userId: 1, recipe: CaramelSliceJSONRecipe })
      expect(response.headers["content-type"]).toContain("json")
    })

    test("body contains id", async () => {
      const response = await request(mockedServer)
        .post("/add")
        .send({ userId: 1, recipe: CaramelSliceJSONRecipe })
      expect(response.body.id).toBe(1)
    })
  })

  describe("invalid request data", () => {
    describe("no bodyy.userId", () => {
      beforeAll(() => {
        MockedAddRecipe.mockResolvedValue(1)
        MockedUserSavesRecipe.mockResolvedValue(1)
      })

      beforeEach(() => {
        jest.clearAllMocks()
      })

      test("Functions are not called", async () => {
        await request(mockedServer)
          .post("/add")
          .send({ recipe: CaramelSliceJSONRecipe })
        expect(MockedAddRecipe).toHaveBeenCalledTimes(0)
        expect(MockedUserSavesRecipe).toHaveBeenCalledTimes(0)
      })

      test("returns status code 200", async () => {
        const response = await request(mockedServer)
          .post("/add")
          .send({ recipe: CaramelSliceJSONRecipe })
        expect(response.statusCode).toBe(400)
      })

      test("header specifies content type json", async () => {
        const response = await request(mockedServer)
          .post("/add")
          .send({ recipe: CaramelSliceJSONRecipe })
        expect(response.headers["content-type"]).toContain("json")
      })

      test("body contains id", async () => {
        const response = await request(mockedServer)
          .post("/add")
          .send({ recipe: CaramelSliceJSONRecipe })
        expect(response.body.error).toBe("No userId")
      })
    })

    describe("no body.recipe", () => {
      beforeAll(() => {
        MockedAddRecipe.mockResolvedValue(1)
        MockedUserSavesRecipe.mockResolvedValue(1)
      })

      beforeEach(() => {
        jest.clearAllMocks()
      })

      test("Functions are not called", async () => {
        await request(mockedServer).post("/add").send({ userId: 1 })
        expect(MockedAddRecipe).toHaveBeenCalledTimes(0)
        expect(MockedUserSavesRecipe).toHaveBeenCalledTimes(0)
      })

      test("returns status code 200", async () => {
        const response = await request(mockedServer)
          .post("/add")
          .send({ userId: 1 })
        expect(response.statusCode).toBe(400)
      })

      test("header specifies content type json", async () => {
        const response = await request(mockedServer)
          .post("/add")
          .send({ userId: 1 })
        expect(response.headers["content-type"]).toContain("json")
      })

      test("body contains id", async () => {
        const response = await request(mockedServer)
          .post("/add")
          .send({ userId: 1 })
        expect(response.body.error).toBe("No jsonRecipe")
      })
    })
  })

  describe("generic errors", () => {
    test("addRecipe() throws", async () => {
      MockedAddRecipe.mockRejectedValueOnce(new Error("Transaction failed"))
      const response = await request(mockedServer)
        .post("/add")
        .send({ userId: 1, recipe: CaramelSliceJSONRecipe })
      expect(response.statusCode).toBe(500)
    })

    test("createRecipeDatabaseObject() throws", async () => {
      MockedUserSavesRecipe.mockImplementationOnce(() => {
        throw new Error("Get failed")
      })
      const response = await request(mockedServer)
        .post("/add")
        .send({ userId: 1, recipe: CaramelSliceJSONRecipe })
      expect(response.statusCode).toBe(500)
    })
  })
})

describe("POST /save/:recipeId", () => {
  describe("valid request data", () => {
    beforeAll(() => {
      MockedUserSavesRecipe.mockResolvedValue(1)
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    test("Functions are called correctly", async () => {
      await request(mockedServer).post("/save/1").send({ userId: 1 })
      expect(MockedUserSavesRecipe).toHaveBeenCalledTimes(1)
      expect(MockedUserSavesRecipe.mock.calls[0][0]).toBe(1)
      expect(MockedUserSavesRecipe.mock.calls[0][1]).toBe(1)
    })

    test("returns status code 200", async () => {
      const response = await request(mockedServer)
        .post("/save/1")
        .send({ userId: 1 })
      expect(response.statusCode).toBe(201)
    })

    test("header specifies content type json", async () => {
      const response = await request(mockedServer)
        .post("/save/1")
        .send({ userId: 1 })
      expect(response.headers["content-type"]).toContain("json")
    })

    test("body contains id", async () => {
      const response = await request(mockedServer)
        .post("/save/1")
        .send({ userId: 1 })
      expect(response.body.id).toBe(1)
    })
  })

  describe("invalid request data", () => {
    describe("no body.userId", () => {
      beforeAll(() => {
        MockedUserSavesRecipe.mockResolvedValue(1)
      })

      beforeEach(() => {
        jest.clearAllMocks()
      })

      test("Functions are not called", async () => {
        await request(mockedServer).post("/save/1").send()
        expect(MockedUserSavesRecipe).toHaveBeenCalledTimes(0)
      })

      test("returns status code 400", async () => {
        const response = await request(mockedServer).post("/save/1").send()
        expect(response.statusCode).toBe(400)
      })

      test("header specifies content type json", async () => {
        const response = await request(mockedServer).post("/save/1").send()
        expect(response.headers["content-type"]).toContain("json")
      })

      test("body contains error", async () => {
        const response = await request(mockedServer).post("/save/1").send()
        expect(response.body.error).toBe("No userId")
      })
    })
  })

  describe("generic errors", () => {
    test("addRecipe() throws", async () => {
      MockedUserSavesRecipe.mockRejectedValueOnce(
        new Error("Transaction failed")
      )
      const response = await request(mockedServer)
        .post("/save/1")
        .send({ userId: 1 })
      expect(response.statusCode).toBe(500)
    })
  })
})

describe("GET /getUserRecipes/:userId", () => {
  describe("valid request data", () => {
    beforeAll(() => {
      MockedGetUsersRecipesByUserId.mockResolvedValue([
        CaramelSliceJSONRecipeWithIds,
      ])
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    test("Functions are called correctly", async () => {
      await request(mockedServer).get("/getUserRecipes/1")
      expect(MockedGetUsersRecipesByUserId).toHaveBeenCalledTimes(1)
      expect(MockedGetUsersRecipesByUserId.mock.calls[0][0]).toBe(1)
    })

    test("returns status code 200", async () => {
      const response = await request(mockedServer).get("/getUserRecipes/1")
      expect(response.statusCode).toBe(200)
    })

    test("header specifies content type json", async () => {
      const response = await request(mockedServer).get("/getUserRecipes/1")
      expect(response.headers["content-type"]).toContain("json")
    })

    test("body contains recipes", async () => {
      const response = await request(mockedServer).get("/getUserRecipes/1")
      expect(response.body.recipes).toEqual([CaramelSliceJSONRecipeWithIds])
      expect(MockedGetUsersRecipesByUserId.mock.calls[0][0]).toBe(1)
    })
  })

  describe("invalid request data", () => {
    test("returns status code 400 with error message Wrong id", async () => {
      jest.clearAllMocks()

      MockedGetUsersRecipesByUserId.mockRejectedValueOnce(
        new GetDBError("recipes")
      )

      const response = await request(mockedServer).get("/getUserRecipes/1")
      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBe(`GetError: Wrong 'recipes' id`)
      expect(MockedGetUsersRecipesByUserId).toHaveBeenCalledTimes(1)
    })
  })

  describe("generic error", () => {
    test("returns status code 500 with error message Something went wrong", async () => {
      jest.clearAllMocks()

      MockedGetUsersRecipesByUserId.mockRejectedValueOnce(
        new Error("Undefined binding(s) detected when compiling FIRST.")
      )

      const response = await request(mockedServer).get("/getUserRecipes/1")
      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe("Something went wrong")
      expect(MockedGetUsersRecipesByUserId).toHaveBeenCalledTimes(1)
    })
  })
})

describe("GET /getRecipe/:recipeId", () => {
  describe("valid request data", () => {
    beforeAll(() => {
      MockedGetRecipeById.mockResolvedValue(CaramelSliceJSONRecipeWithIds)
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    test("Functions are called correctly", async () => {
      await request(mockedServer).get("/getRecipe/1")
      expect(MockedGetRecipeById).toHaveBeenCalledTimes(1)
      expect(MockedGetRecipeById.mock.calls[0][0]).toBe(1)
    })

    test("returns status code 200", async () => {
      const response = await request(mockedServer).get("/getRecipe/1")
      expect(response.statusCode).toBe(200)
    })

    test("header specifies content type json", async () => {
      const response = await request(mockedServer).get("/getRecipe/1")
      expect(response.headers["content-type"]).toContain("json")
    })

    test("body contains recipe", async () => {
      const response = await request(mockedServer).get("/getRecipe/1")
      expect(response.body.recipe).toEqual(CaramelSliceJSONRecipeWithIds)
      expect(MockedGetRecipeById.mock.calls[0][0]).toBe(1)
    })
  })

  describe("invalid request data", () => {
    test("returns status code 400 with error message Wrong id", async () => {
      jest.clearAllMocks()

      MockedGetRecipeById.mockRejectedValueOnce(new GetDBError("recipes"))

      const response = await request(mockedServer).get("/getRecipe/1")
      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBe(`GetError: Wrong 'recipes' id`)
      expect(MockedGetRecipeById).toHaveBeenCalledTimes(1)
    })
  })

  describe("generic error", () => {
    test("returns status code 500 with error message Something went wrong", async () => {
      jest.clearAllMocks()

      MockedGetRecipeById.mockRejectedValueOnce(
        new Error("Undefined binding(s) detected when compiling FIRST.")
      )

      const response = await request(mockedServer).get("/getRecipe/1")
      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe("Something went wrong")
      expect(MockedGetRecipeById).toHaveBeenCalledTimes(1)
    })
  })
})

describe("PATCH /edit", () => {
  describe("valid request data", () => {
    beforeAll(() => {
      MockedUpdateRecipe.mockResolvedValue(1)
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    test("Functions are called correctly", async () => {
      await request(mockedServer)
        .patch("/edit/1")
        .send({ editedRecipe: { cookingTime: { quantity: 40 } } })
      expect(MockedUpdateRecipe).toHaveBeenCalledTimes(1)
      expect(MockedUpdateRecipe.mock.calls[0][0]).toBe(1)
      expect(MockedUpdateRecipe.mock.calls[0][1]).toEqual({
        cookingTime: { quantity: 40 },
      })
    })

    test("returns status code 200", async () => {
      const response = await request(mockedServer)
        .patch("/edit/1")
        .send({ editedRecipe: { cookingTime: { quantity: 40 } } })
      expect(response.statusCode).toBe(200)
    })

    test("header specifies content type json", async () => {
      const response = await request(mockedServer)
        .patch("/edit/1")
        .send({ editedRecipe: { cookingTime: { quantity: 40 } } })
      expect(response.headers["content-type"]).toContain("json")
    })

    test("body contains edited", async () => {
      const response = await request(mockedServer)
        .patch("/edit/1")
        .send({ editedRecipe: { cookingTime: { quantity: 40 } } })
      expect(response.body.edited).toBe(true)
    })
  })

  describe("invalid request data", () => {
    describe("no body.editedRecipe", () => {
      beforeAll(() => {
        MockedUpdateRecipe.mockResolvedValue(1)
      })

      beforeEach(() => {
        jest.clearAllMocks()
      })

      test("Functions are called correctly", async () => {
        await request(mockedServer).patch("/edit/1").send()
        expect(MockedUpdateRecipe).toHaveBeenCalledTimes(0)
      })

      test("returns status code 200", async () => {
        const response = await request(mockedServer).patch("/edit/1").send()
        expect(response.statusCode).toBe(400)
      })

      test("header specifies content type json", async () => {
        const response = await request(mockedServer).patch("/edit/1").send()
        expect(response.headers["content-type"]).toContain("json")
      })

      test("body contains edited", async () => {
        const response = await request(mockedServer).patch("/edit/1").send()
        expect(response.body.error).toBe("No edited recipe")
      })
    })

    test("returns status code 400 with error message Wrong id", async () => {
      jest.clearAllMocks()

      MockedUpdateRecipe.mockRejectedValueOnce(new UpdateDBError())

      const response = await request(mockedServer)
        .patch("/edit/1")
        .send({ editedRecipe: { cooking_time: { quantity: null } } })

      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBe("UpdateError: Wrong id")

      expect(MockedUpdateRecipe).toHaveBeenCalledTimes(1)
    })
  })

  describe("generic error", () => {
    test("returns status code 500 with error message Something went wrong", async () => {
      jest.clearAllMocks()

      MockedUpdateRecipe.mockRejectedValueOnce(
        new Error("Undefined binding(s) detected when compiling FIRST.")
      )

      const response = await request(mockedServer)
        .patch("/edit/1")
        .send({ editedRecipe: { cooking_time: { quantity: null } } })

      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe("Something went wrong")

      expect(MockedUpdateRecipe).toHaveBeenCalledTimes(1)
    })
  })
})

describe("DELETE /unsave", () => {
  describe("valid request data", () => {
    beforeAll(() => {
      MockedDeleteItemBySelector.mockResolvedValue(1)
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    test("Functions are called correctly", async () => {
      await request(mockedServer).delete("/unsave/1").send({ userId: 1 })
      expect(MockedDeleteItemBySelector).toHaveBeenCalledTimes(1)
      expect(MockedDeleteItemBySelector.mock.calls[0][0]).toBe("user_recipes")
      expect(MockedDeleteItemBySelector.mock.calls[0][1]).toEqual({
        user_id: 1,
        recipe_id: 1,
      })
    })

    test("returns status code 200", async () => {
      const response = await request(mockedServer)
        .delete("/unsave/1")
        .send({ userId: 1 })
      expect(response.statusCode).toBe(200)
    })

    test("header specifies content type json", async () => {
      const response = await request(mockedServer)
        .delete("/unsave/1")
        .send({ userId: 1 })
      expect(response.headers["content-type"]).toContain("json")
    })

    test("body contains edited", async () => {
      const response = await request(mockedServer)
        .delete("/unsave/1")
        .send({ userId: 1 })
      expect(response.body.unsaved).toBe(true)
    })
  })

  describe("invalid request data", () => {
    describe("no body.userId", () => {
      beforeAll(() => {
        MockedDeleteItemBySelector.mockResolvedValue(1)
      })

      beforeEach(() => {
        jest.clearAllMocks()
      })

      test("Functions are called correctly", async () => {
        await request(mockedServer).delete("/unsave/1").send()
        expect(MockedDeleteItemBySelector).toHaveBeenCalledTimes(0)
      })

      test("returns status code 200", async () => {
        const response = await request(mockedServer).delete("/unsave/1").send()
        expect(response.statusCode).toBe(400)
      })

      test("header specifies content type json", async () => {
        const response = await request(mockedServer).delete("/unsave/1").send()
        expect(response.headers["content-type"]).toContain("json")
      })

      test("body contains edited", async () => {
        const response = await request(mockedServer).delete("/unsave/1").send()
        expect(response.body.error).toBe("No userId")
      })
    })

    test("returns status code 400 with error message Wrong id", async () => {
      jest.clearAllMocks()

      MockedDeleteItemBySelector.mockRejectedValueOnce(new DeletionDBError())

      const response = await request(mockedServer)
        .delete("/unsave/1")
        .send({ userId: 1 })

      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBe("DeletionError: Wrong id")
      expect(MockedDeleteItemBySelector).toHaveBeenCalledTimes(1)
    })
  })

  describe("generic error", () => {
    test("returns status code 500 with error message Something went wrong", async () => {
      jest.clearAllMocks()

      MockedDeleteItemBySelector.mockRejectedValueOnce(
        new Error("Undefined binding(s) detected when compiling FIRST.")
      )

      const response = await request(mockedServer)
        .delete("/unsave/1")
        .send({ userId: 1 })

      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe("Something went wrong")
      expect(MockedDeleteItemBySelector).toHaveBeenCalledTimes(1)
    })
  })
})
