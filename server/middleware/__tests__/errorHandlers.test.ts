import { agent as request } from "supertest"
import { testServerForMiddleware } from "../../testing/server.mock"
import { errorHandler } from "../errorHandlers"
import { handleErrors } from "../../functions/errorHandlers"

jest.mock("../../functions/errorHandlers")

const MockedHandleErrors = handleErrors as jest.Mock


const mockedServer = testServerForMiddleware(errorHandler)

test('returns back correct status code, error message and header content type', async () => {
  MockedHandleErrors.mockReturnValue({ code: 401, error: "Test Thrown" })
  const response = await request(mockedServer)
    .get("/throwError")
  expect(response.statusCode).toBe(401)
  expect(response.headers["content-type"]).toContain("json")
  expect(response.body.error).toBe("Test Thrown")
})
