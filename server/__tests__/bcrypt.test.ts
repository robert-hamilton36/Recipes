import bcrypt from "bcrypt"
import { comparePasswords, hashPassword } from "../bcrypt"

jest.mock("bcrypt")

const MockedBcryptCompare = bcrypt.compare as jest.Mock
const MockedBcryptGenSalt = bcrypt.genSalt as jest.Mock
const MockedBcryptHash = bcrypt.hash as jest.Mock

describe("comparePasswords", () => {
  test("passwords match", async () => {
    MockedBcryptCompare.mockReturnValueOnce(Promise.resolve(true))
    const result = await comparePasswords(
      "Padme",
      "$2b$10$fJXbx3HB1VPHm9IZJ9f63O.HCPlkwLvG39LHcMgQ1x9sEfVjZ.BL2"
    )
    expect(result).toBeTruthy()
  })
  test("passwords do not match", async () => {
    MockedBcryptCompare.mockImplementationOnce(() => {
      throw "Wrong password"
    })
    try {
      await comparePasswords(
        "padme",
        "$2b$10$fJXbx3HB1VPHm9IZJ9f63O.HCPlkwLvG39LHcMgQ1x9sEfVjZ.BL2"
      )
    } catch (err) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(err).toBe("Wrong password")
    }
  })
})

describe("hashPassword", () => {
  test("hashPassword correctly hashes password", async () => {
    MockedBcryptGenSalt.mockReturnValueOnce(
      Promise.resolve("$2b$10$p37HmyWOsWT/exiPDo0EWO")
    )
    MockedBcryptHash.mockReturnValueOnce(
      Promise.resolve(
        "$2b$10$p37HmyWOsWT/exiPDo0EWOP20ztKhQ6XuLVkWo2Gk4Kc5jVBq50JW"
      )
    )
    const hashedPassword = await hashPassword("padme")
    expect(hashedPassword).toBe(
      "$2b$10$p37HmyWOsWT/exiPDo0EWOP20ztKhQ6XuLVkWo2Gk4Kc5jVBq50JW"
    )
  })
})
