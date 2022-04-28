import request from 'supertest'

import authRouter from "../auth"

import { testServerForRoute } from "../../testing/server.mock"
// imports to mock
import { handleLoginErrors, handleRegisterErrors } from '../errorHandlers'
import { createUser, getUserByEmail } from '../../db/functions/users'
import { comparePasswords, hashPassword } from '../../bcrypt'
import { createToken } from '../../jwt'

jest.mock('../errorHandlers')
jest.mock('../../db/functions/users')
jest.mock('../../bcrypt')
jest.mock('../../jwt')

const MockedHandleLoginErrors = handleLoginErrors as jest.Mock
const MockedHandleRegisterErrors = handleRegisterErrors as jest.Mock

const MockedComparePasswords = comparePasswords as jest.Mock
const MockedHashPassword = hashPassword as jest.Mock

const MockedCreateUser = createUser as jest.Mock
const MockedGetUserByEmail = getUserByEmail as jest.Mock

const MockedCreateToken = createToken as jest.Mock

const mockedServer = testServerForRoute(authRouter)

const mockedJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjZ9.bCPwFmwbYVzA4PtlemRl4blw9rsr8sTLryfspBTmcfc"
const mockRegisterData = {
  firstName: "Anakin",
  lastName: "Skywalker",
  email: "AniSky@walker.com",
  password: "Padme"
}

const mockLoginData = {
  email: "AniSky@walker.com",
  password: "Padme"
}
const mockHashedPassword = '$2b$10$fJXbx3HB1VPHm9IZJ9f63O.HCPlkwLvG39LHcMgQ1x9sEfVjZ.BL2'

describe('POST /register', () => {
  describe('valid request data', () => {
    beforeAll(() => {
      MockedHashPassword.mockReturnValue(mockHashedPassword)
      MockedCreateUser.mockReturnValue(66)
      MockedCreateToken.mockReturnValue(mockedJWT)
    })

    test('sends back status code 200', async () => {
      const response = await request(mockedServer).post('/test/register').send(mockRegisterData)
      expect(response.statusCode).toBe(200)
    })

    test('header specifies content type json', async () => {
      const response = await request(mockedServer).post('/test/register').send(mockRegisterData)
      expect(response.headers['content-type']).toContain('json')
    })

    test('cookie contains jwt token and correct settings', async () => {
      const response = await request(mockedServer).post('/test/register').send(mockRegisterData)
      expect(response.headers["set-cookie"][0]).toContain(mockedJWT)
      expect(response.headers["set-cookie"][0]).toContain('HttpOnly')
      expect(response.headers["set-cookie"][0]).toContain('Max-Age=' + 7 * 24 * 60 * 60)
    })

    test('body contains id', async () => {
      const response = await request(mockedServer).post('/test/register').send(mockRegisterData)
      expect(response.body.id).toBe(66)
    })
  })

  describe('username already in database', () => {
    beforeAll(() => {
      MockedHashPassword.mockReturnValue(mockHashedPassword)
      MockedHandleRegisterErrors.mockReturnValue({
        statusCode: 400,
        error: 'Username is taken'
      })
    })
    test('sends back status code 400 with correct error message sqlite3', async () => {
      MockedCreateUser.mockImplementationOnce(() => {
        throw {
          errno: 19,
          message: "SQLITE_CONSTRAINT"
        }
      })
      const response = await request(mockedServer).post('/test/register').send(mockRegisterData)
      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBe('Username is taken')
    })

    // this assumes pg error codes are the same as sqlite3
    test('sends back status code 400 with correct error message pg', async () => {
      MockedCreateUser.mockImplementationOnce(() => {
        throw {
          errno: 23505,
          message: "UNIQUE_CONSTRAINT"
        }
      })
      const response = await request(mockedServer).post('/test/register').send(mockRegisterData)
      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBe('Username is taken')
    })
  })

})

describe('GET /login', () => {
  describe('valid request data', () => {
    beforeAll(() => {
      MockedGetUserByEmail.mockReturnValue({userId: 66, ...mockRegisterData})
      MockedComparePasswords.mockReturnValue(true)
      MockedCreateToken.mockReturnValue(mockedJWT)
    })
    test('sends back status code 200', async () => {
      const response = await request(mockedServer).get('/test/login').send(mockLoginData)
      expect(response.statusCode).toBe(200)
    })

    test('header specifies content type json', async () => {
      const response = await request(mockedServer).get('/test/login').send(mockLoginData)
      expect(response.headers['content-type']).toContain('json')
    })

    test('body contains id', async () => {
      const response = await request(mockedServer).get('/test/login').send(mockLoginData)
      expect(response.body.id).toBe(66)
    })

    test('cookie contains jwt token and correct settings', async () => {
      const response = await request(mockedServer).get('/test/login').send(mockLoginData)
      expect(response.headers["set-cookie"][0]).toContain(mockedJWT)
      expect(response.headers["set-cookie"][0]).toContain('HttpOnly')
      expect(response.headers["set-cookie"][0]).toContain('Max-Age=' + 7 * 24 * 60 * 60)
    })

  })

  describe('invalid email or password', () => {
    test('invalid email sends status code 400 with correct error message', async () => {
      MockedGetUserByEmail.mockImplementationOnce(() => {
        throw new Error('Email does not exist')
      })
      MockedHandleLoginErrors.mockReturnValueOnce({
        statusCode: 400,
        error: 'Email does not exist'
      })
      const response = await request(mockedServer).get('/test/login').send({ email: 'AniSky@walker.com', password: 'P4dm3' })
      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBe('Email does not exist')
    })

    test('wrong password sends status code 400 with correct error message', async () => {
      MockedGetUserByEmail.mockReturnValueOnce({id: 66, ...mockRegisterData})
      MockedComparePasswords.mockImplementationOnce(() => {
        throw new Error('Wrong password')
      })
      MockedHandleLoginErrors.mockReturnValueOnce({
        statusCode: 400,
        error: 'Wrong password'
      })
      const response = await request(mockedServer).get('/test/login').send({ email: 'ani@jedi.org', password: 'Padme' })
      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBe('Wrong password')
    })
  })
})