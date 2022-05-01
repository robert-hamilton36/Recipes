import bcrypt from 'bcrypt'

export async function comparePasswords (requestPassword: string, dbhashPassword: string) {
  const passwordsMatch = await bcrypt.compare(requestPassword, dbhashPassword)

  if (passwordsMatch) {
    return true
  } else {
    throw 'Wrong password'
  }
}

export async function hashPassword (password: string) {
  const salt = await bcrypt.genSalt()
  return await bcrypt.hash(password, salt)
}