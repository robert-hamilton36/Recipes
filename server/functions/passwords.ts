import bcrypt from 'bcrypt'

export async function comparePasswords (requestPassword: string, dbhashPassword: string) {
  return await bcrypt.compare(requestPassword, dbhashPassword)
}

export async function hashPassword (password: string) {
  const salt = await bcrypt.genSalt()
  return await bcrypt.hash(password, salt)
}