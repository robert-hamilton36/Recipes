import request from 'supertest'

import recipeRouter from '../recipe'
import { testServerForRoute } from '../../testing/server.mock'
import { CaramelSliceJSONRecipe } from '../../testing/mockdata/JSONRecipe'

// functions to mock
import { addRecipeToDatabase } from '../../functions/recipes'

jest.mock('../../functions/recipes')

const MockedAddRecipeToDatabase = addRecipeToDatabase as jest.Mock


const mockedServer = testServerForRoute(recipeRouter)


describe('POST', () => {
  test('returns status code 200', async () => {
    MockedAddRecipeToDatabase.mockResolvedValueOnce(1)
    const response = await request(mockedServer).post('/test').send({
      recipe: CaramelSliceJSONRecipe,
      userId: 1
    })
    expect(response.statusCode).toBe(200)
  })

  test('header specifies content type json', async () => {
    MockedAddRecipeToDatabase.mockResolvedValueOnce(1)
    const response = await request(mockedServer).post('/test').send({
      recipe: CaramelSliceJSONRecipe,
      userId: 1
    })
    expect(response.headers['content-type']).toContain('json')
  })

  test('body contains id', async () => {
    MockedAddRecipeToDatabase.mockResolvedValueOnce(1)
    const response = await request(mockedServer).post('/test').send({
      recipe: CaramelSliceJSONRecipe,
      userId: 1
    })
    expect(response.body.id).toBe(1)
  })

  test('addRecipeToDatabase throws', async () => {
    MockedAddRecipeToDatabase.mockRejectedValueOnce('error')
    const response = await request(mockedServer).post('/test').send({
      recipe: CaramelSliceJSONRecipe,
      userId: 1
    })
    expect(response.statusCode).toBe(500)
    expect(response.body.err).toBe('failed')
  })
})