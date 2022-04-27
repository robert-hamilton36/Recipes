import express from 'express'

import { handleLoginErrors, handleRegisterErrors } from './errorHandlers'
import { createUser, getUserByEmail } from '../db/functions/users'
import { comparePasswords, hashPassword } from '../bcrypt'
import { createToken } from '../jwt'

const authRouter = express.Router()

authRouter.get('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await getUserByEmail(email)
    const passwordsMatch = await comparePasswords(password, user.passwordHash)

    if (passwordsMatch) {
      return res.json({ 
        token: createToken(user.userId) 
      })
    } else {
      throw new Error('Wrong password')
    }
  } catch(err: unknown) {
    const { statusCode, error } = handleLoginErrors(err)
    return res.status(statusCode).json({error})
  }
})

authRouter.post('/register', async (req, res) => {
  const { password, ...user } = req.body
  user.passwordHash = await hashPassword(password)

  try {
    const newId = await createUser(user)
    return res.json({
      token: createToken(newId)
    })
  } catch(err: unknown) {
    const { statusCode, error } = handleRegisterErrors(err)
    return res.status(statusCode).json({error})
  }
})


export default authRouter
