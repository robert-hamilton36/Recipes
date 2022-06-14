// handles errors for route controllers
// if its a user error sends back 400 and a specific error
// if its a server error sends back 500 and a general
// would log errors if implemented

import {
  DeletionDBError,
  GetDBError,
  UpdateDBError,
} from "../db/functions/crudDBErrors"

export interface KnexError extends Error {
  code: string
  errno: number
}

interface ErrorCode {
  code: number
  error: string
}

export const isUniqueConstraintError = (e: unknown) => {
  // Thrown from database error addItemToDatabase
  // 19 is sqlite3 error code for unique constraint
  // 23505 is pg error code, need to test this format is repeated for pg
  if (e instanceof Error) {
    const error = e as KnexError
    if (error?.errno === 23505 || error?.errno === 19) {
      return true
    }
  }
  return false
}

export const handleErrors = (err: unknown): ErrorCode => {
  if (isUniqueConstraintError(err)) {
    return {
      code: 400,
      error: "Email is taken",
    }
  }

  if (err instanceof Error) {
    // Wrong password thrown from loginUser() from  controllers/auth
    // Email does not exist thrown from getUserByEmail() /db/functions/users
    if (
      err.message === "Wrong password" ||
      err.message === "Email does not exist"
    ) {
      return {
        code: 400,
        error: err.message,
      }
    }
  }

  if (
    err instanceof GetDBError ||
    err instanceof DeletionDBError ||
    err instanceof UpdateDBError
  ) {
    if (err.itemType) {
      return {
        code: 400,
        error: `${err.name}: Wrong '${err.itemType}' id`,
      }
    }
    return {
      code: 400,
      error: `${err.name}: Wrong id`,
    }
  }

  return {
    code: 500,
    error: "Something went wrong",
  }
}
