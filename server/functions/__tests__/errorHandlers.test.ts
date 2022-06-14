import {
  DeletionDBError,
  GetDBError,
  UpdateDBError,
} from "../../db/functions/crudDBErrors"
import {
  handleErrors,
  isUniqueConstraintError
} from "../errorHandlers"

interface KnexError extends Error {
  code: string
  errno: number
}

class KnexError extends Error {
  constructor(message: string, errorCode: number) {
    super(message)
    this.errno = errorCode
  }
}

describe("isUniqueConstraintError()", () => {
  beforeAll(() => {
    jest.requireActual("../errorHandlers")
  })
  test("returns true for pg error", () => {
    const pgError = new KnexError("Unique Constraint", 23505)

    const result = isUniqueConstraintError(pgError)
    expect(result).toBe(true)
  })

  test("returns true for sqlite3 error", () => {
    const pgError = new KnexError("Unique Constraint", 19)

    const result = isUniqueConstraintError(pgError)
    expect(result).toBe(true)
  })

  test("returns false for KnexError with other erro codes", () => {
    const knexError = new KnexError("Sqlite Full", 13)

    const result = isUniqueConstraintError(knexError)
    expect(result).toBe(false)
  })

  test("returns false for generic Error object", () => {
    const error = new Error("Error!")

    const result = isUniqueConstraintError(error)
    expect(result).toBe(false)
  })

  test("returns false for generic object", () => {
    const obj = { message: "Error!" }

    const result = isUniqueConstraintError(obj)
    expect(result).toBe(false)
  })
})

describe("handleErrors()", () => {
  const MockIsUniqueContraintError = jest.fn()

  jest.doMock("../errorHandlers", () => {
    return {
      __esModule: true,
      isUniqueConstraintError: MockIsUniqueContraintError,
    }
  })

  test("returns http code 400 and error Email is taken, with a unique constraint error", () => {
    MockIsUniqueContraintError.mockResolvedValueOnce(true)
    const pgError = new KnexError("Unique Constraint", 23505)
    const handledData = handleErrors(pgError)

    expect(handledData).toEqual({
      code: 400,
      error: "Email is taken",
    })
  })

  test("returns http code 400 and error Wrong password, with a password error", () => {
    const passwordError = new Error("Wrong password")
    const handledData = handleErrors(passwordError)

    expect(handledData).toEqual({
      code: 400,
      error: "Wrong password",
    })
  })

  test("returns http code 400 and error Email does not exist, with a email error", () => {
    const emailError = new Error("Email does not exist")
    const handledData = handleErrors(emailError)

    expect(handledData).toEqual({
      code: 400,
      error: "Email does not exist",
    })
  })

  describe("for GetDBError | DeletionDBError | UpdateDBError", () => {
    describe("no given itemType", () => {
      test("returns code: 400, error: Wrong id, with GetDBError()", () => {
        const err = new GetDBError()
        const { code, error } = handleErrors(err)

        expect(code).toBe(400)
        expect(error).toBe("GetError: Wrong id")
      })

      test("returns code: 400, error: Wrong id, with UpdateDBError()", () => {
        const err = new UpdateDBError()
        const { code, error } = handleErrors(err)

        expect(code).toBe(400)
        expect(error).toBe("UpdateError: Wrong id")
      })

      test("returns code: 400, error: Wrong id, with DeletionDBError()", () => {
        const err = new DeletionDBError()
        const { code, error } = handleErrors(err)

        expect(code).toBe(400)
        expect(error).toBe("DeletionError: Wrong id")
      })
    })

    describe("given itemType", () => {
      test("returns code: 400, error: Wrong id, with GetDBError()", () => {
        const err = new GetDBError("recipes")
        const { code, error } = handleErrors(err)

        expect(code).toBe(400)
        expect(error).toBe("GetError: Wrong 'recipes' id")
      })

      test("returns code: 400, error: Wrong id, with UpdateDBError()", () => {
        const err = new UpdateDBError("user_recipes")
        const { code, error } = handleErrors(err)

        expect(code).toBe(400)
        expect(error).toBe("UpdateError: Wrong 'user_recipes' id")
      })

      test("returns code: 400, error: Wrong id, with DeletionDBError()", () => {
        const err = new DeletionDBError("ingredients")
        const { code, error } = handleErrors(err)

        expect(code).toBe(400)
        expect(error).toBe("DeletionError: Wrong 'ingredients' id")
      })
    })
  })

  test("returns code: 500, error:Something went wrong, with generic error", () => {
    const err = new Error("Oh no!")
    const { code, error } = handleErrors(err)

    expect(code).toBe(500)
    expect(error).toBe("Something went wrong")
  })

  test("returns code: 500, error:Something went wrong, with generic object", () => {
    const err = {}
    const { code, error } = handleErrors(err)

    expect(code).toBe(500)
    expect(error).toBe("Something went wrong")
  })
 
})
