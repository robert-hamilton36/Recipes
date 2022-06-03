import request from 'supertest'

import recipeRouter from '../recipe'

import { testServerForRoute } from "../../testing/server.mock"
import { CaramelSliceJSONRecipe, CaramelSliceJSONRecipeWithIds } from '../../testing/mockdata/JSONRecipe'
import { CaramelSliceDatabaseObject } from '../../testing/mockdata/recipeDatabaseObject'
import { DeletionDBError, GetDBError, UpdateDBError } from '../../db/functions/crudDBErrors'

//__________________________________________ functions to mock __________________________________________________
import { addRecipe, deleteAllTraceOfRecipe, getRecipeById, getUsersRecipesByUserId, updateRecipe } from "../../db/functions/recipe"
import { createRecipeDatabaseObject } from "../../functions/createDatabaseObjects"
import { handleGetUpdateDeleteRecipes } from '../../functions/errorHandlers'
import { deleteItemBySelector, getItemsBySelector } from '../../db/functions/basicCrud'

jest.mock("../../db/functions/recipe")
jest.mock("../../functions/createDatabaseObjects")
jest.mock('../../functions/errorHandlers')
jest.mock('../../db/functions/basicCrud')

const MockedAddRecipe = addRecipe as jest.Mock
const MockedCreateRecipeDatabaseObject = createRecipeDatabaseObject as jest.Mock
const MockedGetUsersRecipesByUserId = getUsersRecipesByUserId as jest.Mock
const MockedHandleGetUpdateDeleteRecipes = handleGetUpdateDeleteRecipes as jest.Mock
const MockedGetRecipeById = getRecipeById as jest.Mock
const MockedUpdateRecipe = updateRecipe as jest.Mock
const MockedGetItemsBySelector = getItemsBySelector as jest.Mock
const MockedDeleteAllTraceOfRecipe = deleteAllTraceOfRecipe as jest.Mock
const MockedDeleteItemBySelector = deleteItemBySelector as jest.Mock

//___________________________________________ end function mocks _________________________________________________

const mockedServer = testServerForRoute(recipeRouter)

describe('POST /add', () => {
  describe('valid request data', () => {
    beforeAll(() => {
      MockedAddRecipe.mockResolvedValue(1)
      MockedCreateRecipeDatabaseObject.mockResolvedValue(CaramelSliceDatabaseObject)
    })
    test('returns status code 200', async () => {
      const response = await request(mockedServer).post('/add').send({userId: 1, recipe: CaramelSliceJSONRecipe})
      expect(response.statusCode).toBe(200)
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
      MockedCreateRecipeDatabaseObject.mockImplementationOnce(() =>{ throw new Error('property last_name missing')})
      const response = await request(mockedServer).post('/add').send({userId: 1, recipe: CaramelSliceJSONRecipe})
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
      const response = await request(mockedServer).patch('/edit').send({edit: { cookingTime: { quantity: 40 } } })
      expect(response.statusCode).toBe(200)
    })

    test('header specifies content type json', async () => {
      const response = await request(mockedServer).patch('/edit').send({edit: { cookingTime: { quantity: 40 } } })
      expect(response.headers['content-type']).toContain('json')
    })
  
    test('body contains edited', async () => {
      const response = await request(mockedServer).patch('/edit').send({edit: { cookingTime: { quantity: 40 } } })
      expect(response.body.edited).toBe(true)
    })
  })

  describe('invalid request data', () => {
    test('returns status code 400 with error message Wrong id', async () => {
      MockedUpdateRecipe.mockRejectedValueOnce( new UpdateDBError())
      MockedHandleGetUpdateDeleteRecipes.mockReturnValueOnce({ code: 400, error: 'UpdateError: Wrong id'})
      const response = await request(mockedServer).patch('/edit').send({edit: { cooking_time: { quantity: null } } })
      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBe('UpdateError: Wrong id')
    })
  })

  describe('generic error', () => {
    test('returns status code 500 with error message Something went wrong', async () => {
      MockedUpdateRecipe.mockRejectedValueOnce( new Error('Undefined binding(s) detected when compiling FIRST.'))
      MockedHandleGetUpdateDeleteRecipes.mockReturnValueOnce({ code: 500, error: 'Something went wrong'})
      const response = await request(mockedServer).patch('/edit').send({edit: { cooking_time: { quantity: null } } })
      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe('Something went wrong')
    })
  })
})


describe('Delete /delete/1', () => {
  describe('valid request data', () => {
      describe('recipe saved by one person', () => {
        beforeAll(() => {
          MockedGetItemsBySelector.mockResolvedValue([{ id: 1, user_id: 1, recipe_id: 1}])
          MockedDeleteAllTraceOfRecipe.mockImplementation(() => Promise.resolve())
        })

        beforeEach(() => {
          jest.clearAllMocks()
        })
    
        test('returns status code 200', async () => {
          const response = await request(mockedServer).delete('/delete/1').send({ userId: 1 })
          expect(response.statusCode).toBe(200)
        })
    
        test('header specifies content type json', async () => {
          const response = await request(mockedServer).delete('/delete/1').send({ userId: 1 })
          expect(response.headers['content-type']).toContain('json')
        })
      
        test('body contains deleted', async () => {
          const response = await request(mockedServer).delete('/delete/1').send({ userId: 1 })
          expect(response.body.deleted).toBe(true)
          expect(MockedDeleteAllTraceOfRecipe).toHaveBeenCalledTimes(1)
          expect(MockedDeleteItemBySelector).toHaveBeenCalledTimes(0)
          expect(MockedDeleteAllTraceOfRecipe).toHaveBeenCalledWith(1) //from '/delete/1'
        })
      })

      describe('recipe saved by multiple people', () => {
        beforeAll(() => {
          MockedGetItemsBySelector.mockResolvedValue([{ id: 1, user_id: 1, recipe_id: 1}, { id: 2, user_id: 2, recipe_id: 1}])
          MockedDeleteAllTraceOfRecipe.mockImplementation(() => Promise.resolve())
        })
    
        afterEach(() => {
          jest.clearAllMocks()
        })
    
        test('returns status code 200', async () => {
          const response = await request(mockedServer).delete('/delete/1').send({ userId: 1 })
          expect(response.statusCode).toBe(200)
        })
    
        test('header specifies content type json', async () => {
          const response = await request(mockedServer).delete('/delete/1').send({ userId: 1 })
          expect(response.headers['content-type']).toContain('json')
        })
      
        test('body contains deleted', async () => {
          const response = await request(mockedServer).delete('/delete/1').send({ userId: 1 })
          expect(response.body.deleted).toBe(true)
          expect(MockedDeleteAllTraceOfRecipe).toHaveBeenCalledTimes(0)
          expect(MockedDeleteItemBySelector).toHaveBeenCalledTimes(1)
          expect(MockedDeleteItemBySelector).toHaveBeenCalledWith('user_recipes', { user_id: 1, recipe_id: 1}) //user_id from body, recipe_id from params 
        })
      })
    })
  
  describe('invalid request data', () => {
    test('returns status code 400 with error message Wrong id, when sent wrong user_id', async () => {
      MockedGetItemsBySelector.mockResolvedValue([{ id: 1, user_id: 1, recipe_id: 1}])
      MockedDeleteItemBySelector.mockRejectedValueOnce( new DeletionDBError('user_recipes') )
      MockedHandleGetUpdateDeleteRecipes.mockReturnValueOnce({ code: 400, error: `GetError: Wrong 'user_recipes' id`})
      const response = await request(mockedServer).delete('/delete/1').send({ userId: 999 })
      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBe(`GetError: Wrong 'user_recipes' id`)
      expect(MockedDeleteItemBySelector).toHaveBeenCalledTimes(1)
    })

    test('returns status code 400 with error message Wrong id, when sent wrong recipe_id', async () => {
      MockedGetItemsBySelector.mockRejectedValueOnce( new GetDBError('user_recipes') )
      MockedHandleGetUpdateDeleteRecipes.mockReturnValueOnce({ code: 400, error: `DeletionError: Wrong 'user_recipes' id`})
      const response = await request(mockedServer).delete('/delete/999').send({ userId: 1 })
      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBe(`DeletionError: Wrong 'user_recipes' id`)
    })
  })

  describe('generic error', () => {
    test('returns status code 500 with error message Something went wrong', async () => {
      MockedGetItemsBySelector.mockRejectedValueOnce( new Error('Undefined binding(s) detected when compiling FIRST.'))
      MockedHandleGetUpdateDeleteRecipes.mockReturnValueOnce({ code: 500, error: 'Something went wrong'})
      const response = await request(mockedServer).delete('/delete/1')
      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe('Something went wrong')
    })
  })
})