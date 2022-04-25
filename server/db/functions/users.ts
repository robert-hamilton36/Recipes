import connection from '../connection'
import { UserDB } from '../types/users'

export async function getUsers (db = connection): Promise<UserDB[]> {
  return await db('users').select()
}