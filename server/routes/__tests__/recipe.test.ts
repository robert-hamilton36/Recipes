import request from 'supertest'

import recipeRouter from '../recipe'

import { testServerForRoute } from "../../testing/server.mock"
import { CaramelSliceJSONRecipe, CaramelSliceJSONRecipeWithIds } from '../../testing/mockdata/JSONRecipe'
import { DeletionDBError, GetDBError, UpdateDBError } from '../../db/functions/crudDBErrors'

//__________________________________________ functions to mock __________________________________________________
import { addRecipe, getRecipeById, getUsersRecipesByUserId, updateRecipe, userSavesRecipe } from "../../db/functions/recipe"
import { handleGetUpdateDeleteRecipes } from '../../functions/errorHandlers'
import { deleteItemBySelector } from '../../db/functions/basicCrud'

jest.mock("../../db/functions/recipe")
jest.mock('../../functions/errorHandlers')
jest.mock('../../db/functions/basicCrud')

const MockedAddRecipe = addRecipe as jest.Mock
const MockedUserSavesRecipe = userSavesRecipe as jest.Mock
const MockedGetUsersRecipesByUserId = getUsersRecipesByUserId as jest.Mock
const MockedHandleGetUpdateDeleteRecipes = handleGetUpdateDeleteRecipes as jest.Mock
const MockedGetRecipeById = getRecipeById as jest.Mock
const MockedUpdateRecipe = updateRecipe as jest.Mock
const MockedDeleteItemBySelector = deleteItemBySelector as jest.Mock

//___________________________________________ end function mocks _________________________________________________

const mockedServer = testServerForRoute(recipeRouter)

describe('POST /add', () => {
  describe('valid request data', () => {
    beforeAll(() => {
      MockedAddRecipe.mockResolvedValue(1)
      MockedUserSavesRecipe.mockResolvedValue(1)
    })
    test('returns status code 200', async () => {
      const response = await request(mockedServer).post('/add').send({userId: 1, recipe: CaramelSliceJSONRecipe})
      expect(response.statusCode).toBe(201)
    })

    test('header specifies content type json', async () => {
      const response = await request(mockedServer).post('/add').send({userId: 1, recipe: CaramelSliceJSONRecipe})
      expect(response.headers['content-type']).toContain('json')
    })
  
    test('body contains id', async () => {
      const response = await request(mockedServer).post('/add').send({userId: 1, recipe: CaramelSliceJSONRecipe})
      expect(response.body.id).toBe(1)
    })
  })

  describe('generic errors', () => {
    test('addRecipe() throws', async () => {
      MockedAddRecipe.mockRejectedValueOnce(new Error('Transaction failed'))
      const response = await request(mockedServer).post('/add').send({userId: 1, recipe: CaramelSliceJSONRecipe})
      expect(response.statusCode).toBe(500)
    })

    test('createRecipeDatabaseObject() throws', async () => {
      MockedUserSavesRecipe.mockImplementationOnce(() =>{ throw new Error('Get failed')})
      const response = await request(mockedServer).post('/add').send({userId: 1, recipe: CaramelSliceJSONRecipe})
      expect(response.statusCode).toBe(500)
    })
  })
})

describe('POST /save/:recipeId', () => {
  describe('valid request data', () => {
    beforeAll(() => {
      MockedUserSavesRecipe.mockResolvedValue(1)
    })
    test('returns status code 200', async () => {
      const response = await request(mockedServer).post('/save/1').send({ userId: 1 })
      expect(response.statusCode).toBe(201)
    })

    test('header specifies content type json', async () => {
      const response = await request(mockedServer).post('/save/1').send({ userId: 1 })
      expect(response.headers['content-type']).toContain('json')
    })
  
    test('body contains id', async () => {
      const response = await request(mockedServer).post('/save/1').send({ userId: 1 })
      expect(response.body.id).toBe(1)
    })
  })

  describe('generic errors', () => {
    test('addRecipe() throws', async () => {
      MockedUserSavesRecipe.mockRejectedValueOnce(new Error('Transaction failed'))
      const response = await request(mockedServer).post('/save/1').send({ userId: 1 })
      expect(response.statusCode).toBe(500)
    })
  })
})

describe('GET /getUserRecipes/:userId', () => {
  describe('valid request data', () => {
    beforeAll(() => {
      MockedGetUsersRecipesByUserId.mockResolvedValue([CaramelSliceJSONRecipeWithIds])
    })

    test('returns status code 200', async () => {
      const response = await request(mockedServer).get('/getUserRecipes/1')
      expect(response.statusCode).toBe(200)
    })

    test('header specifies content type json', async () => {
      const response = await request(mockedServer).get('/getUserRecipes/1')
      expect(response.headers['content-type']).toContain('json')
    })
  
    test('body contains recipes', async () => {
      const response = await request(mockedServer).get('/getUserRecipes/1')
      expect(response.body.recipes).toEqual([CaramelSliceJSONRecipeWithIds])
      expect(MockedGetUsersRecipesByUserId.mock.calls[0][0]).toBe(1)
    })
  })

  describe('invalid request data', () => {
    test('returns status code 400 with error message Wrong id', async () => {
      MockedGetUsersRecipesByUserId.mockRejectedValueOnce(new GetDBError('recipes'))
      MockedHandleGetUpdateDeleteRecipes.mockReturnValueOnce({ code: 400, error: `GetError: Wrong 'recipes' id`})
      const response = await request(mockedServer).get('/getUserRecipes/1')
      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBe(`GetError: Wrong 'recipes' id`)
    })
  })

  describe('generic error', () => {
    test('returns status code 500 with error message Something went wrong', async () => {
      MockedGetUsersRecipesByUserId.mockRejectedValueOnce(new Error('Undefined binding(s) detected when compiling FIRST.'))
      MockedHandleGetUpdateDeleteRecipes.mockReturnValueOnce({ code: 500, error: 'Something went wrong'})
      const response = await request(mockedServer).get('/getUserRecipes/1')
      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe('Something went wrong')
    })
  })
})

describe('GET /getRecipe/:recipeId', () => {
  describe('valid request data', () => {
    beforeAll(() => {
      MockedGetRecipeById.mockResolvedValue(CaramelSliceJSONRecipeWithIds)
    })

    test('returns status code 200', async () => {
      const response = await request(mockedServer).get('/getRecipe/1')
      expect(response.statusCode).toBe(200)
    })

    test('header specifies content type json', async () => {
      const response = await request(mockedServer).get('/getRecipe/1')
      expect(response.headers['content-type']).toContain('json')
    })
  
    test('body contains recipe', async () => {
      const response = await request(mockedServer).get('/getRecipe/1')
      expect(response.body.recipe).toEqual(CaramelSliceJSONRecipeWithIds)
      expect(MockedGetUsersRecipesByUserId.mock.calls[0][0]).toBe(1)
    })
  })

  describe('invalid request data', () => {
    test('returns status code 400 with error message Wrong id', async () => {
      MockedGetRecipeById.mockRejectedValueOnce(new GetDBError('recipes'))
      MockedHandleGetUpdateDeleteRecipes.mockReturnValueOnce({ code: 400, error: `GetError: Wrong 'recipes' id`})
      const response = await request(mockedServer).get('/getRecipe/1')
      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBe(`GetError: Wrong 'recipes' id`)
    })
  })

  describe('generic error', () => {
    test('returns status code 500 with error message Something went wrong', async () => {
      MockedGetRecipeById.mockRejectedValueOnce(new Error('Undefined binding(s) detected when compiling FIRST.'))
      MockedHandleGetUpdateDeleteRecipes.mockReturnValueOnce({ code: 500, error: 'Something went wrong'})
      const response = await request(mockedServer).get('/getRecipe/1')
      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe('Something went wrong')
    })
  })
})

describe('PATCH /edit', () => {
  describe('valid request data', () => {
    beforeAll(() => {
      MockedUpdateRecipe.mockResolvedValue(1)
    })

    test('returns status code 200', async () => {
      const response = await request(mockedServer).patch('/edit/1').send({editRecipe: { cookingTime: { quantity: 40 } } })
      expect(response.statusCode).toBe(200)
    })

    test('header specifies content type json', async () => {
      const response = await request(mockedServer).patch('/edit/1').send({editRecipe: { cookingTime: { quantity: 40 } } })
      expect(response.headers['content-type']).toContain('json')
    })
  
    test('body contains edited', async () => {
      const response = await request(mockedServer).patch('/edit/1').send({editRecipe: { cookingTime: { quantity: 40 } } })
      expect(response.body.edited).toBe(true)
    })
  })

  describe('invalid request data', () => {
    test('returns status code 400 with error message Wrong id', async () => {
      MockedUpdateRecipe.mockRejectedValueOnce( new UpdateDBError())
      MockedHandleGetUpdateDeleteRecipes.mockReturnValueOnce({ code: 400, error: 'UpdateError: Wrong id'})
      const response = await request(mockedServer).patch('/edit/1').send({editRecipe: { cooking_time: { quantity: null } } })
      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBe('UpdateError: Wrong id')
    })
  })

  describe('generic error', () => {
    test('returns status code 500 with error message Something went wrong', async () => {
      MockedUpdateRecipe.mockRejectedValueOnce( new Error('Undefined binding(s) detected when compiling FIRST.'))
      MockedHandleGetUpdateDeleteRecipes.mockReturnValueOnce({ code: 500, error: 'Something went wrong'})
      const response = await request(mockedServer).patch('/edit/1').send({editRecipe: { cooking_time: { quantity: null } } })
      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe('Something went wrong')
    })
  })
})

describe('DELETE /unsave', () => {
  describe('valid request data', () => {
    beforeAll(() => {
      MockedDeleteItemBySelector.mockResolvedValue(1)
    })

    test('returns status code 200', async () => {
      const response = await request(mockedServer).delete('/unsave/1').send({ userId: 1 })
      expect(response.statusCode).toBe(200)
    })

    test('header specifies content type json', async () => {
      const response = await request(mockedServer).delete('/unsave/1').send({ userId: 1 })
      expect(response.headers['content-type']).toContain('json')
    })
  
    test('body contains edited', async () => {
      const response = await request(mockedServer).delete('/unsave/1').send({ userId: 1 })
      expect(response.body.unsaved).toBe(true)
    })
  })

  describe('invalid request data', () => {
    test('returns status code 400 with error message Wrong id', async () => {
      MockedDeleteItemBySelector.mockRejectedValueOnce( new DeletionDBError())
      MockedHandleGetUpdateDeleteRecipes.mockReturnValueOnce({ code: 400, error: 'DeletionError: Wrong id' })
      const response = await request(mockedServer).delete('/unsave/1').send({ userId: 1 })
      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBe('DeletionError: Wrong id')
    })
  })

  describe('generic error', () => {
    test('returns status code 500 with error message Something went wrong', async () => {
      MockedDeleteItemBySelector.mockRejectedValueOnce( new Error('Undefined binding(s) detected when compiling FIRST.'))
      MockedHandleGetUpdateDeleteRecipes.mockReturnValueOnce({ code: 500, error: 'Something went wrong'})
      const response = await request(mockedServer).delete('/unsave/1').send({ userId: 1 })
      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe('Something went wrong')
    })
  })
})
