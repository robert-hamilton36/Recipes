import { Request, Response } from "express";

import { addItemToDatabase, deleteItemBySelector, updateItemBySelector } from "../db/functions/basicCrud";
import { changeUserPassword, getUserByEmail } from "../db/functions/users";

import { comparePasswords, hashPassword } from "../functions/passwords";
import { createToken } from "../functions/jwt";
import { createUserDatabaseObject } from "../functions/createDatabaseObjects";
import { handleLoginErrors, handleRegistrationErrors } from "../functions/errorHandlers";

import { IncomingUser } from "../types/User";

const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days

export const registerUser = async (req: Request, res: Response) => {
  const user = req.body.user as IncomingUser

  
  try {
    const password = await hashPassword(user.password)
    const userDatabaseObject = createUserDatabaseObject(user, password)
    
    const newUserId = await addItemToDatabase('users', userDatabaseObject)
    const token = createToken(newUserId)

    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge } )
    res.json({ id: newUserId })
  } catch (err: unknown) {
    const { code, error } = handleRegistrationErrors(err)
    return res.status(code).json({ error })
  }
}

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const user = await getUserByEmail(email)
    const passwordsMatch = await comparePasswords(password, user.password_hash)

    if (passwordsMatch) {
      const token = createToken(user.id)

      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge } )
      res.json({ id: user.id })
    } else {
      throw new Error('Wrong password')
    }
  } catch(err: unknown) {
    const { code, error } = handleLoginErrors(err)
    return res.status(code).json({error})
  }
}

// todo check and test error handlers

export const changePassword = async (req: Request, res: Response) => {
  const { email, oldPassword, newPassword } = req.body

  try {
    const user = await getUserByEmail(email)
    const passwordsMatch = await comparePasswords(oldPassword, user.password_hash)
    
    if (passwordsMatch) {
      const hashNewPassword = await hashPassword(newPassword)
      await changeUserPassword(email, hashNewPassword)

      res.json({ passwordChanged: true })
    } else {
      throw new Error('Wrong password')
    }

  } catch(err: unknown) {
    const { code, error } = handleLoginErrors(err)
    return res.status(code).json({
      error,
      passwordChanged: false
    })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  const editedUser = req.body.user as IncomingUser
  const email = req.body.email as string
  const password = req.body.password as string

  try {
    const dbUser = await getUserByEmail(email)
    const passwordsMatch = await comparePasswords(password, dbUser.password_hash)

    if (passwordsMatch) {
      const editedUserDatabaseObject = createUserDatabaseObject(editedUser)
      await updateItemBySelector('users', { email }, editedUserDatabaseObject)

      return res.json({ userUpdated: true })
    } else {
      throw new Error('Wrong password')
    }
  } catch(err: unknown) {
    const { code, error } = handleLoginErrors(err)
    return res.status(code).json({
      error,
      userUpdated: false
    })
  }
}

export const logoutUser = async (req: Request, res: Response) => {
  res.cookie('jwt', '', { httpOnly: true, maxAge: 1 } )
  res.json({ id: null })
}

export const deleteUser = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const user = await getUserByEmail(email)
    const passwordsMatch = await comparePasswords(password, user.password_hash)

    if (passwordsMatch) {
      await deleteItemBySelector('users', { email })
      res.cookie('jwt', '', { httpOnly: true, maxAge: 1 } )
      res.json({ deleted: true })

    } else {
      throw new Error('Wrong password')
    }
  } catch(err: unknown) {
    const { code, error } = handleLoginErrors(err)
    return res.status(code).json({error})
  }
}