import jwt from "jsonwebtoken"
import { createToken } from "../jwt"

jest.mock("jsonwebtoken")

const MockedJWTSIGN = jwt.sign as jest.Mock

// todo reconsider this whole test it seems stupid

test('process', () => {
  MockedJWTSIGN.mockReturnValueOnce('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjZ9.I299ox0RqXZbNLt5AG3yFzeU_vrBNaPodjtM4DdLyPg')
  const jwt = createToken(66)
  expect(jwt).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjZ9.I299ox0RqXZbNLt5AG3yFzeU_vrBNaPodjtM4DdLyPg')
})