import connection from '../connection'
import { UserDatabase } from '../../../types/DatabaseObjects'

const db = connection

export async function getAllUsers (): Promise<UserDatabase[]> {
  return await db('users').select()
}

export async function getUserByEmail (email: string): Promise<UserDatabase> {
  return await db('users')
    .select()
    .first()
    .where('email', email)
    .then((user) => {
      if(user) {
        return user
      } else {
        throw new Error('Email does not exist')
      }
    })
}

export async function createUser(user: Partial<UserDatabase>): Promise<number> {
  return await db('users').insert(user).then(id => id[0])
}

export async function deleteUserByEmail(email: string): Promise<number> {
  return await db('users').select().first().where('email', email).delete()
}

export async function deleteUserById(id: number): Promise<number> {
  return await db('users').select().first().where('id', id).delete()
}