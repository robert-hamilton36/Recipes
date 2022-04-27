export const handleLoginErrors = (err: unknown) => {
  if (err instanceof Error) {
    // Wrong password thrown from function comparePasswords ./bcrypt
    // Email does not exist thrown from function getUserByEmail /db/functions/users
    if (err.message === 'Wrong password' || err.message === 'Email does not exist') {
      return {
        statusCode: 400,
        error: err.message
      }
    } 
     
    return {
      statusCode: 500,
      error: err.message
    }
  }

  return {
    statusCode: 500,
    error: 'Something werid happened'
  }
}

export const handleRegisterErrors = (err: unknown) => {
  const error = err as KnexError
  // Thrown from database error createUser /db/functions/users
  // 19 is sqlite3 error code for unique constraint
  // 23505 is pg error code, need to test this format is repeated for pg
  if (error.errno === 23505 || error.errno === 19) {
    return {
      statusCode: 400,
      error: 'Email is taken'
    }
  }
  else {
    return {
      statusCode: 500,
      error: error.message
    }
  }
}

interface KnexError extends Error{
  code: string;
  errno: number
}