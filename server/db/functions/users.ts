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

export async function changeUserPassword(email: string, password: string): Promise<number> {
  return await db('users').select().first().where('email', email).update('password_hash', password)
}

