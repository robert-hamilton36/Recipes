import express from 'express'

import { handleLoginErrors, handleRegisterErrors } from './errorHandlers'
import { createUser, deleteUserByEmail, getUserByEmail } from '../db/functions/users'
import { comparePasswords, hashPassword } from '../utility/bcrypt'
import { createToken } from '../utility/jwt'

const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days

const authRouter = express.Router()

authRouter.get('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await getUserByEmail(email)
    const passwordsMatch = await comparePasswords(password, user.password_hash)

    if (passwordsMatch) {
      res.cookie('jwt', createToken(user.id), { httpOnly: true, maxAge: maxAge } )
      res.json({ id: user.id})
    } else {
      throw new Error('Wrong password')
    }
  } catch(err: unknown) {
    const { statusCode, error } = handleLoginErrors(err)
    return res.status(statusCode).json({error})
  }
})

authRouter.post('/register', async (req, res) => {
  const { passwordHash: password, ... user } =  req.body
  user.passwordHash = await hashPassword(password)

  try {
    const newId = await createUser(user)
    res.cookie('jwt', createToken(newId), { httpOnly: true, maxAge: maxAge } )
    res.json({ id: newId })
  } catch(err: unknown) {
    const { statusCode, error } = handleRegisterErrors(err)
    return res.status(statusCode).json({error})
  }
})

authRouter.delete('/delete', async (req, res) => {
  console.log('delete')
  try {
    await deleteUserByEmail(req.body.email)
    res.json({ message: 'user deleted'})
  } catch (err: unknown) {
    return res.status(500).json({error: err})
  }
})


export default authRouter
