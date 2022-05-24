import jwt from "jsonwebtoken"

// imports to mock
import { createToken } from "../jwt"

jest.mock('jsonwebtoken')

const MockedJWTSIGN = jwt.sign as jest.Mock

// todo reconsider this whole test it seems redundant

describe('createToken()', () => {
  test('creates a webtoken', () => {
    MockedJWTSIGN.mockReturnValueOnce('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjYsImlhdCI6MTY1Mjc1NTQzNiwiZXhwIjoxNjUzMzYwMjM2fQ.zPoeUbf0DW9AOQMn35dyzV6l5qVTTy0FEUMGeZWgxe4')
    const jwt = createToken(66)
    expect(jwt).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjYsImlhdCI6MTY1Mjc1NTQzNiwiZXhwIjoxNjUzMzYwMjM2fQ.zPoeUbf0DW9AOQMn35dyzV6l5qVTTy0FEUMGeZWgxe4')
  })
})
