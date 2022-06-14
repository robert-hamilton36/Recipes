import jwt from "jsonwebtoken"
import { agent as request } from "supertest"
import { testServerForMiddleware } from "../../testing/server.mock"
import { requireAuth } from "../authorization"

jest.mock("jsonwebtoken")

const MockedJwtVerify = jwt.verify as jest.Mock

const mockedServer = testServerForMiddleware(requireAuth)
const mockedCookie =
  "jwt= $2b$10$fJXbx3HB1VPHm9IZJ9f63O.HCPlkwLvG39LHcMgQ1x9sEfVjZ.BL2"

test("valid jwtcookie passes through middleware", async () => {
  MockedJwtVerify.mockReturnValueOnce({
    id: 2,
    iat: 1651133507,
    exp: 1651219907,
  })
  const response = await request(mockedServer)
    .get("/")
    .set("cookie", mockedCookie)
  expect(response.statusCode).toBe(200)
  expect(response.body.result).toBe("no error")
})

test("invalid jwtcookie throws error", async () => {
  MockedJwtVerify.mockImplementationOnce(() => {
    throw "Invalid Token"
  })
  const response = await request(mockedServer)
    .get("/")
    .set("cookie", mockedCookie)
  expect(response.statusCode).toBe(401)
  expect(response.body.error).toBe("Invalid token")
})

test("no jwtcookie throws error", async () => {
  const response = await request(mockedServer)
    .get("/")
  expect(response.statusCode).toBe(401)
  expect(response.body.error).toBe("Missing token")
})
