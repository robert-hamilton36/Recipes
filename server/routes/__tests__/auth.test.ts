import request from "supertest"

import authRouter from "../auth"

import { testServerForRoute } from "../../testing/server.mock"
import {
  HashedPasswordData,
  JWTData,
  AnakinRegisterData,
  AnakinLoginData,
  AnakinWrongPasswordLoginData,
  AnakinWrongEmailLoginData,
  HashedPasswordData2,
  AnakinChangePasswordData,
  AnakinWrongEmailChangePasswordData,
  AnakinWrongPasswordChangePasswordData,
  AnakingUpdateInfoData,
} from "../../testing/mockdata/JSONUser"
import {
  IncomingAnakinDatabaseObject,
  IncomingAnakinEditDatabaseObject,
  OutgoingAnakinDatabaseObject,
} from "../../testing/mockdata/userDatabaseObject"

//_______________functions to mock_________________________________________________________________________________________________

import {
  addItemToDatabase,
  deleteItemBySelector,
  updateItemBySelector,
} from "../../db/functions/basicCrud"
import { changeUserPassword, getUserByEmail } from "../../db/functions/users"

import { comparePasswords, hashPassword } from "../../functions/passwords"
import { createToken } from "../../functions/jwt"
import { createUserDatabaseObject } from "../../functions/createDatabaseObjects"
import { KnexError } from "../../functions/errorHandlers"

jest.mock("../../db/functions/basicCrud")
jest.mock("../../db/functions/users")

jest.mock("../../functions/passwords")
jest.mock("../../functions/jwt")
jest.mock("../../functions/createDatabaseObjects")

const MockedAddItemToDatabase = addItemToDatabase as jest.Mock

const MockedChangeUserPassword = changeUserPassword as jest.Mock
const MockedDeleteItemBySelector = deleteItemBySelector as jest.Mock
const MockedGetUserByEmail = getUserByEmail as jest.Mock
const MockedUpdateItemBySelector = updateItemBySelector as jest.Mock

const MockedComparePasswords = comparePasswords as jest.Mock
const MockedHashPassword = hashPassword as jest.Mock

const MockedCreateToken = createToken as jest.Mock

const MockedCreateUserDatabaseObject = createUserDatabaseObject as jest.Mock

//___________end functions to mock_________________________________________________________________________________________________

const mockedServer = testServerForRoute(authRouter)

describe("POST /register", () => {
  describe("valid request data", () => {
    beforeAll(() => {
      MockedHashPassword.mockResolvedValue(HashedPasswordData)
      MockedCreateUserDatabaseObject.mockReturnValue(
        IncomingAnakinDatabaseObject
      )
      MockedAddItemToDatabase.mockResolvedValue(1)
      MockedCreateToken.mockReturnValue(JWTData)
    })

    test("returns status code 200", async () => {
      const response = await request(mockedServer)
        .post("/register")
        .send({ user: AnakinRegisterData })
      expect(response.statusCode).toBe(201)
    })

    test("header specifies content type json", async () => {
      const response = await request(mockedServer)
        .post("/register")
        .send({ user: AnakinRegisterData })
      expect(response.headers["content-type"]).toContain("json")
    })

    test("cookie contains jwt token with correct settings", async () => {
      const response = await request(mockedServer)
        .post("/register")
        .send({ user: AnakinRegisterData })
      expect(response.headers["set-cookie"][0]).toContain(JWTData)
      expect(response.headers["set-cookie"][0]).toContain("HttpOnly")
      expect(response.headers["set-cookie"][0]).toContain(
        "Max-Age=" + 7 * 24 * 60 * 60
      )
    })

    test("body contains id", async () => {
      const response = await request(mockedServer)
        .post("/register")
        .send({ user: AnakinRegisterData })
      expect(response.body.id).toBe(1)
    })
  })

  describe("email is already taken request data", () => {
    beforeAll(() => {
      MockedHashPassword.mockResolvedValue(HashedPasswordData)
      MockedCreateUserDatabaseObject.mockReturnValue(
        IncomingAnakinDatabaseObject
      )
    })
    test("returns status code 400 with Email taken error message for sqlite3", async () => {
      const MockedError = new Error("UNIQUE_CONSTRAINT") as KnexError
      MockedError.errno = 19
      MockedAddItemToDatabase.mockRejectedValueOnce(MockedError)

      const response = await request(mockedServer)
        .post("/register")
        .send({ user: AnakinRegisterData })

      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBe("Email is taken")
    })

    test("returns status code 400 with Email taken error message for postgres", async () => {
      const MockedError = new Error("UNIQUE_CONSTRAINT") as KnexError
      MockedError.errno = 23505
      MockedAddItemToDatabase.mockRejectedValueOnce(MockedError)

      const response = await request(mockedServer)
        .post("/register")
        .send({ user: AnakinRegisterData })
      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBe("Email is taken")
    })
  })

  describe("generic errors", () => {
    test("returns status code 500 with generic error message for generic hashPassword errors", async () => {
      MockedHashPassword.mockRejectedValueOnce({
        error: "No idea what errors this may throw",
      })

      const response = await request(mockedServer)
        .post("/register")
        .send({ user: AnakinRegisterData })
      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe("Something went wrong")
    })

    test("returns status code 500 with generic error message for generic createUserDatabaseObject errors", async () => {
      MockedHashPassword.mockResolvedValueOnce(HashedPasswordData)
      MockedCreateUserDatabaseObject.mockImplementationOnce(() => {
        throw new Error("TypeError: can't access property 'x' of 'y'")
      })
 
      const response = await request(mockedServer)
        .post("/register")
        .send({ user: AnakinRegisterData })
      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe("Something went wrong")
    })

    test("returns status code 500 with generic error message for generic addItemToDatabase errors", async () => {
      MockedHashPassword.mockResolvedValueOnce(HashedPasswordData)
      MockedCreateUserDatabaseObject.mockReturnValueOnce(
        IncomingAnakinDatabaseObject
      )
      MockedAddItemToDatabase.mockRejectedValueOnce({
        errno: 18,
        message: "SQLITE_TOOBIG",
      })
 
      const response = await request(mockedServer)
        .post("/register")
        .send({ user: AnakinRegisterData })
      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe("Something went wrong")
    })

    test("returns status code 500 with generic error message for generic createToken errors", async () => {
      MockedHashPassword.mockResolvedValueOnce(HashedPasswordData)
      MockedCreateUserDatabaseObject.mockReturnValueOnce(
        IncomingAnakinDatabaseObject
      )
      MockedAddItemToDatabase.mockResolvedValueOnce(1)
      MockedCreateToken.mockImplementationOnce(() => {
        throw Error("Error: data and hash arguments required")
      })
 
      const response = await request(mockedServer)
        .post("/register")
        .send({ user: AnakinRegisterData })
      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe("Something went wrong")
    })
  })
})

describe("GET /login", () => {
  describe("valid request data", () => {
    beforeAll(() => {
      MockedGetUserByEmail.mockResolvedValue(OutgoingAnakinDatabaseObject)
      MockedComparePasswords.mockResolvedValue(true)
      MockedCreateToken.mockReturnValue(JWTData)
    })

    test("returns status code 200", async () => {
      const response = await request(mockedServer)
        .get("/login")
        .send(AnakinLoginData)
      expect(response.statusCode).toBe(200)
    })

    test("header specifies content type json", async () => {
      const response = await request(mockedServer)
        .get("/login")
        .send(AnakinLoginData)
      expect(response.headers["content-type"]).toContain("json")
    })

    test("cookie contains jwt token with correct settings", async () => {
      const response = await request(mockedServer)
        .get("/login")
        .send(AnakinLoginData)
      expect(response.headers["set-cookie"][0]).toContain(JWTData)
      expect(response.headers["set-cookie"][0]).toContain("HttpOnly")
      expect(response.headers["set-cookie"][0]).toContain(
        "Max-Age=" + 7 * 24 * 60 * 60
      )
    })

    test("body contains id", async () => {
      const response = await request(mockedServer)
        .get("/login")
        .send(AnakinLoginData)
      expect(response.body.id).toBe(1)
    })
  })

  describe("invalid request data", () => {
    test("returns status code 400, with Email does not exist error message", async () => {
      MockedGetUserByEmail.mockRejectedValueOnce(
        new Error("Email does not exist")
      )

      const response = await request(mockedServer)
        .get("/login")
        .send(AnakinWrongEmailLoginData)
      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBe("Email does not exist")
    })

    test("returns status code 400, with Wrong password error message", async () => {
      MockedGetUserByEmail.mockResolvedValue(OutgoingAnakinDatabaseObject)
      MockedComparePasswords.mockResolvedValueOnce(false)
 
      const response = await request(mockedServer)
        .get("/login")
        .send(AnakinWrongPasswordLoginData)
      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBe("Wrong password")
    })
  })

  describe("generic errors", () => {
    test("returns status code 500 with generic went wrong message, for random getUserByEmail error", async () => {
      MockedGetUserByEmail.mockRejectedValueOnce(
        new Error("Undefined binding(s) detected when compiling FIRST.")
      )

      const response = await request(mockedServer)
        .get("/login")
        .send(AnakinWrongEmailLoginData)
      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe("Something went wrong")
    })

    test("returns status code 500 with generic went wrong message, for random comparePasswords error", async () => {
      MockedGetUserByEmail.mockResolvedValueOnce(OutgoingAnakinDatabaseObject)
      MockedComparePasswords.mockRejectedValueOnce(
        new Error("Error: variable password does not exist")
      )

      const response = await request(mockedServer)
        .get("/login")
        .send(AnakinLoginData)
      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe("Something went wrong")
    })

    test("returns status code 500 with generic went wrong message, for random createToken error", async () => {
      MockedGetUserByEmail.mockResolvedValueOnce(OutgoingAnakinDatabaseObject)
      MockedComparePasswords.mockResolvedValueOnce(true)
      MockedCreateToken.mockImplementationOnce(() => {
        throw Error("Error: data and hash arguments required")
      })

      const response = await request(mockedServer)
        .get("/login")
        .send(AnakinLoginData)
      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe("Something went wrong")
    })
  })
})

describe("PATCH /changePassword", () => {
  describe("valid request data", () => {
    beforeAll(() => {
      MockedGetUserByEmail.mockResolvedValue(1)
      MockedComparePasswords.mockResolvedValue(true)
      MockedHashPassword.mockResolvedValue(HashedPasswordData2)
      MockedChangeUserPassword.mockResolvedValue(1)
    })
    test("returns status code 200", async () => {
      const response = await request(mockedServer)
        .patch("/changePassword")
        .send(AnakinChangePasswordData)
      expect(response.statusCode).toBe(200)
    })

    test("header specifies content type json", async () => {
      const response = await request(mockedServer)
        .patch("/changePassword")
        .send(AnakinChangePasswordData)
      expect(response.headers["content-type"]).toContain("json")
    })

    test("body contains passwordChanged", async () => {
      const response = await request(mockedServer)
        .patch("/changePassword")
        .send(AnakinChangePasswordData)
      expect(response.body.passwordChanged).toBeTruthy()
    })
  })

  describe("invalid request data", () => {
    test("returns status code 400 with error message Email not found", async () => {
      MockedGetUserByEmail.mockRejectedValueOnce(
        new Error("Email does not exist")
      )

      const response = await request(mockedServer)
        .patch("/changePassword")
        .send(AnakinWrongEmailChangePasswordData)
      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBe("Email does not exist")
      expect(response.body.passwordChanged).toBeFalsy()
    })

    test("returns status code 400 with error message Wrong password", async () => {
      MockedGetUserByEmail.mockResolvedValueOnce(OutgoingAnakinDatabaseObject)
      MockedComparePasswords.mockResolvedValueOnce(false)

      const response = await request(mockedServer)
        .patch("/changePassword")
        .send(AnakinWrongPasswordChangePasswordData)
      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBe("Wrong password")
      expect(response.body.passwordChanged).toBeFalsy()
    })
  })

  describe("generic errors", () => {
    test("returns status code 500 with generic went wrong message, for generic getUserByEmail error", async () => {
      MockedGetUserByEmail.mockRejectedValueOnce(
        new Error("Undefined binding(s) detected when compiling FIRST.")
      )

      const response = await request(mockedServer)
        .patch("/changePassword")
        .send(AnakinWrongEmailChangePasswordData)
      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe("Something went wrong")
    })

    test("returns status code 500 with generic went wrong message, for generic comparePasswords error", async () => {
      MockedGetUserByEmail.mockResolvedValueOnce(OutgoingAnakinDatabaseObject)
      MockedComparePasswords.mockRejectedValueOnce(
        new Error("Error: variable password does not exist")
      )


      const response = await request(mockedServer)
        .patch("/changePassword")
        .send(AnakinWrongEmailChangePasswordData)
      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe("Something went wrong")
    })

    test("returns status code 500 with generic went wrong message, for generic hashPassword error", async () => {
      MockedGetUserByEmail.mockResolvedValueOnce(OutgoingAnakinDatabaseObject)
      MockedComparePasswords.mockResolvedValueOnce(true)
      MockedHashPassword.mockRejectedValueOnce({
        error: "No idea what errors this may throw",
      })

      const response = await request(mockedServer)
        .patch("/changePassword")
        .send(AnakinWrongEmailChangePasswordData)
      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe("Something went wrong")
    })

    test("returns status code 500 with generic went wrong message, for generic changeUserPassword error", async () => {
      MockedGetUserByEmail.mockResolvedValueOnce(OutgoingAnakinDatabaseObject)
      MockedComparePasswords.mockResolvedValueOnce(true)
      MockedHashPassword.mockResolvedValueOnce(HashedPasswordData2)
      MockedChangeUserPassword.mockRejectedValueOnce(
        new Error("Undefined binding(s) detected when compiling FIRST.")
      )

      const response = await request(mockedServer)
        .patch("/changePassword")
        .send(AnakinWrongEmailChangePasswordData)
      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe("Something went wrong")
    })
  })
})

// technically this could change email as well, and would then need registerError handlers as well,
// but currently planning that the client should not allow this
describe("PATCH /updateUser", () => {
  describe("valid request data", () => {
    beforeAll(() => {
      MockedGetUserByEmail.mockResolvedValue(1)
      MockedComparePasswords.mockResolvedValue(true)
      MockedCreateUserDatabaseObject.mockResolvedValue(
        IncomingAnakinEditDatabaseObject
      )
      MockedUpdateItemBySelector.mockResolvedValue(1)
    })
    test("returns status code 200", async () => {
      const response = await request(mockedServer)
        .patch("/updateUser")
        .send(AnakingUpdateInfoData)
      expect(response.statusCode).toBe(200)
    })

    test("header specifies content type json", async () => {
      const response = await request(mockedServer)
        .patch("/updateUser")
        .send(AnakingUpdateInfoData)
      expect(response.headers["content-type"]).toContain("json")
    })

    test("body contains userUpdated", async () => {
      const response = await request(mockedServer)
        .patch("/updateUser")
        .send(AnakingUpdateInfoData)
      expect(response.body.userUpdated).toBeTruthy()
    })
  })

  describe("invalid request data", () => {
    test("returns status code 400 with error message Email does not exist", async () => {
      MockedGetUserByEmail.mockRejectedValueOnce(
        new Error("Email does not exist")
      )

      const response = await request(mockedServer)
        .patch("/updateUser")
        .send(AnakingUpdateInfoData)

      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBe("Email does not exist")
      expect(response.body.userUpdated).toBeFalsy()
    })

    test("returns status code 400 with error message Wrong password", async () => {
      MockedGetUserByEmail.mockResolvedValueOnce(1)
      MockedComparePasswords.mockResolvedValueOnce(false)

      const response = await request(mockedServer)
        .patch("/updateUser")
        .send(AnakingUpdateInfoData)

      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBe("Wrong password")
      expect(response.body.userUpdated).toBeFalsy()
    })
  })

  describe("generic errors", () => {
    test("returns status code 500 with generic went wrong message, for generic getUserByEmail error", async () => {
      MockedGetUserByEmail.mockRejectedValueOnce(
        new Error("Undefined binding(s) detected when compiling FIRST.")
      )

      const response = await request(mockedServer)
        .patch("/updateUser")
        .send(AnakingUpdateInfoData)
      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe("Something went wrong")
    })

    test("returns status code 500 with generic went wrong message, for generic comparePasswords error", async () => {
      MockedGetUserByEmail.mockResolvedValueOnce(OutgoingAnakinDatabaseObject)
      MockedComparePasswords.mockRejectedValueOnce(
        new Error("Error: variable password does not exist")
      )

      const response = await request(mockedServer)
        .patch("/updateUser")
        .send(AnakingUpdateInfoData)
      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe("Something went wrong")
    })

    test("returns status code 500 with generic went wrong message, for generic createUserDatabaseObject error", async () => {
      MockedGetUserByEmail.mockResolvedValueOnce(OutgoingAnakinDatabaseObject)
      MockedComparePasswords.mockResolvedValueOnce(true)
      MockedCreateUserDatabaseObject.mockImplementationOnce(() => {
        throw new Error("TypeError: can't access property 'x' of 'y'")
      })

      const response = await request(mockedServer)
        .patch("/updateUser")
        .send(AnakingUpdateInfoData)
      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe("Something went wrong")
    })

    test("returns status code 500 with generic went wrong message, for generic updateItemBySelector error", async () => {
      MockedGetUserByEmail.mockResolvedValueOnce(OutgoingAnakinDatabaseObject)
      MockedComparePasswords.mockResolvedValueOnce(true)
      MockedCreateUserDatabaseObject.mockReturnValueOnce(
        IncomingAnakinEditDatabaseObject
      )
      MockedUpdateItemBySelector.mockRejectedValueOnce(
        new Error("Cannot find 'email' email")
      ) // /?some error

      const response = await request(mockedServer)
        .patch("/updateUser")
        .send(AnakingUpdateInfoData)
      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe("Something went wrong")
    })
  })
})

describe("PATCH /logout", () => {
  test("returns status code 200", async () => {
    const response = await request(mockedServer).patch("/logout").send()
    expect(response.statusCode).toBe(200)
  })

  test("header specifies content type json", async () => {
    const response = await request(mockedServer).patch("/logout").send()
    expect(response.headers["content-type"]).toContain("json")
  })

  // cookie shouldn't exist for long enough, I think.
  // or else it never exists
  test("cookie contains jwt token with correct settings", async () => {
    const response = await request(mockedServer).post("/logout").send()
    expect(response.headers["set-cookie"]).toBeUndefined()
  })

  test("body contains userUpdated", async () => {
    const response = await request(mockedServer).patch("/logout").send()
    expect(response.body.id).toBeNull()
  })
})

describe("DELETE /delete", () => {
  describe("valid request data", () => {
    beforeAll(() => {
      MockedGetUserByEmail.mockResolvedValue(1)
      MockedComparePasswords.mockResolvedValue(true)
      MockedDeleteItemBySelector.mockResolvedValue(1)
    })
    test("returns status code 200", async () => {
      const response = await request(mockedServer)
        .delete("/delete")
        .send(AnakinLoginData)
      expect(response.statusCode).toBe(200)
    })

    test("header specifies content type json", async () => {
      const response = await request(mockedServer)
        .delete("/delete")
        .send(AnakinLoginData)
      expect(response.headers["content-type"]).toContain("json")
    })

    test("body contains userUpdated", async () => {
      const response = await request(mockedServer)
        .delete("/delete")
        .send(AnakinLoginData)
      expect(response.body.deleted).toBeTruthy()
    })
  })

  describe("invalid request data", () => {
    test("returns status code 400 with error message Email does not exist", async () => {
      MockedGetUserByEmail.mockRejectedValueOnce(
        new Error("Email does not exist")
      )

      const response = await request(mockedServer)
        .delete("/delete")
        .send(AnakinWrongEmailLoginData)

      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBe("Email does not exist")
      expect(response.body.userUpdated).toBeFalsy()
    })

    test("returns status code 400 with error message Wrong password", async () => {
      MockedGetUserByEmail.mockResolvedValueOnce(1)
      MockedComparePasswords.mockResolvedValueOnce(false)

      const response = await request(mockedServer)
        .delete("/delete")
        .send(AnakinWrongPasswordLoginData)

      expect(response.statusCode).toBe(400)
      expect(response.body.error).toBe("Wrong password")
      expect(response.body.userUpdated).toBeFalsy()
    })
  })

  describe("generic errors", () => {
    test("returns status code 500 with generic went wrong message, for generic getUserByEmail error", async () => {
      MockedGetUserByEmail.mockRejectedValueOnce(
        new Error("Undefined binding(s) detected when compiling FIRST.")
      )

      const response = await request(mockedServer)
        .delete("/delete")
        .send(AnakinLoginData)
      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe("Something went wrong")
    })

    test("returns status code 500 with generic went wrong message, for generic comparePasswords error", async () => {
      MockedGetUserByEmail.mockResolvedValueOnce(OutgoingAnakinDatabaseObject)
      MockedComparePasswords.mockRejectedValueOnce(
        new Error("Error: variable password does not exist")
      )

      const response = await request(mockedServer)
        .delete("/delete")
        .send(AnakinLoginData)
      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe("Something went wrong")
    })

    test("returns status code 500 with generic went wrong message, for generic deleteItemBySelector error", async () => {
      MockedGetUserByEmail.mockResolvedValueOnce(OutgoingAnakinDatabaseObject)
      MockedComparePasswords.mockResolvedValueOnce(true)
      MockedDeleteItemBySelector.mockRejectedValueOnce(
        new Error("Cannot email of type undefined")
      )

      const response = await request(mockedServer)
        .delete("/delete")
        .send(AnakinLoginData)
      expect(response.statusCode).toBe(500)
      expect(response.body.error).toBe("Something went wrong")
    })
  })
})
