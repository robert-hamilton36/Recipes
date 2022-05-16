import request from 'supertest'

import recipeRouter from '../recipe'
import { testServerForRoute } from '../../testing/server.mock'
import { CaramelSliceJSONRecipe } from '../../testing/mockdata/JSONRecipe'
import { CaramelSliceDatabaseObject } from '../../testing/mockdata/recipeDatabaseObject'

// functions to mock
import { addRecipe } from '../../db/functions/recipe'
import { parseJSONRecipeToPartialRecipeDatabaseObject } from '../../utility/cleanJSONRecipeToDatabaseObjects'


jest.mock('../../db/functions/recipe')
jest.mock('../../utility/cleanJSONRecipeToDatabaseObjects')

const MockedAddRecipe = addRecipe as jest.Mock
const MockedParseJSON = parseJSONRecipeToPartialRecipeDatabaseObject as jest.Mock


const mockedServer = testServerForRoute(recipeRouter)


describe('POST', () => {
  test('returns status code 200', async () => {
    MockedAddRecipe.mockResolvedValueOnce(1)
    MockedParseJSON.mockResolvedValueOnce(CaramelSliceDatabaseObject)
    const response = await request(mockedServer).post('/test').send({
      recipe: CaramelSliceJSONRecipe,
      userId: 1
    })
    expect(response.statusCode).toBe(200)
  })

  test('header specifies content type json', async () => {
    MockedAddRecipe.mockResolvedValueOnce(1)
    MockedParseJSON.mockResolvedValueOnce(CaramelSliceDatabaseObject)
    const response = await request(mockedServer).post('/test').send({
      recipe: CaramelSliceJSONRecipe,
      userId: 1
    })
    expect(response.headers['content-type']).toContain('json')
  })

  test('body contains id', async () => {
    MockedAddRecipe.mockResolvedValueOnce(1)
    MockedParseJSON.mockResolvedValueOnce(CaramelSliceDatabaseObject)

    const response = await request(mockedServer).post('/test').send({
      recipe: CaramelSliceJSONRecipe,
      userId: 1
    })
    expect(response.body.id).toBe(1)
  })

  test('addRecipeToDatabase throws', async () => {
    MockedAddRecipe.mockRejectedValueOnce('error')
    const response = await request(mockedServer).post('/test').send({
      recipe: CaramelSliceJSONRecipe,
      userId: 1
    })
    expect(response.statusCode).toBe(500)
    expect(response.body.err).toBe('failed')
  })
})