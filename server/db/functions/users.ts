import { UserDatabase } from '../../types/DatabaseObjects'
import connection from '../connection'

const db = connection

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

export async function updateUserByEmail(email: string, user: Partial<UserDatabase>): Promise<number> {
  return await db('users').where('email', email).update(user)
}

export async function changeUserPassword(email: string, password: string): Promise<number> {
  return await db('users').select().first().where('email', email).update('password_hash', password)
}

export async function deleteUserByEmail(email: string): Promise<number> {
  return await db('users').select().first().where('email', email).delete()
}
