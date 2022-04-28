import connection from "../connection"
import { UserDB } from "../types/users"

interface NewUser {
  firstName: string
  lastName: string
  email: string
  passwordHash: string
}

export async function getAllUsers(db = connection): Promise<UserDB[]> {
  return await db("users").select()
}

export async function getUserByEmail(
  email: string,
  db = connection
): Promise<UserDB> {
  return await db("users")
    .select()
    .first()
    .where("email", email)
    .then((user) => {
      if (user) {
        return user
      } else {
        throw new Error("Email does not exist")
      }
    })
}

export async function createUser(
  user: NewUser,
  db = connection
): Promise<number> {
  return await db("users")
    .insert(user)
    .then((id) => id[0])
}
