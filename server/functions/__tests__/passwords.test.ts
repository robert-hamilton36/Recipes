import { comparePasswords, hashPassword } from "../passwords"

// imports to mock
import bcrypt from "bcrypt"
import { HashedPassword } from "../../testing/mockdata/JSONUser"

jest.mock("bcrypt")

const MockedBcryptCompare = bcrypt.compare as jest.Mock
const MockedBcryptGenSalt = bcrypt.genSalt as jest.Mock
const MockedBcryptHash = bcrypt.hash as jest.Mock

describe("comparePasswords()", () => {
  test("matches two equal passwords", async () => {
    MockedBcryptCompare.mockResolvedValueOnce(true)

    const result = await comparePasswords("Padme", HashedPassword)
    expect(result).toBe(true)
  })

  test("mismatches two different passwords", async () => {
    MockedBcryptCompare.mockResolvedValueOnce(false)

    const result = await comparePasswords("padme", HashedPassword)
    expect(result).toBe(false)
  })
})

describe("hashPassword()", () => {
  test("returns hashed password", async () => {
    MockedBcryptGenSalt.mockResolvedValueOnce("$2b$10$fJXbx3HB1VPHm9IZJ9f63O")
    MockedBcryptHash.mockResolvedValueOnce(HashedPassword)

    const result = await hashPassword("Padme")
    expect(result).toBe(HashedPassword)
  })
})
