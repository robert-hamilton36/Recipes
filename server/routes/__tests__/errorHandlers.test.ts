import { handleLoginErrors, handleRegisterErrors } from "../errorHandlers"

describe('handleLoginErrors', () => {
  test('handles wrong password error', () => {
    const error = new Error('Wrong password')
    const handledData = handleLoginErrors(error)

    expect(handledData).toEqual({
      statusCode: 400,
      error: 'Wrong password'
    })
  })
  test('handles no email error', () => {
    const error = new Error('Email does not exist') 
    const handledData = handleLoginErrors(error)

    expect(handledData).toEqual({
      statusCode: 400,
      error: 'Email does not exist'
    })
  })
  test('handles unspecified error', () => {
    const error = new Error('Something else')
    const handledData = handleLoginErrors(error)

    expect(handledData).toEqual({
      statusCode: 500,
      error: 'Something else'
    })
  })
  test('handles non error', () => {
    const error = ('Something werid')
    const handledData = handleLoginErrors(error)

    expect(handledData).toEqual({
      statusCode: 500,
      error: 'Something weird happened'
    })
  })
})

describe('handleRegisterErrors', () => {
  test('handles pg database Unique Email Constraint', () => {
    const error = { errno: 23505 }
    const handledData = handleRegisterErrors(error)

    expect(handledData).toEqual({
      statusCode: 400,
      error: 'Email is taken'
    })
  })

  test('handles sqlite3 database Unique Email Constraint', () => {
    const error = { errno: 19 }
    const handledData = handleRegisterErrors(error)

    expect(handledData).toEqual({
      statusCode: 400,
      error: 'Email is taken'
    })
  })

  test('handles unspecified error', () => {
    const error = new Error('Something else')
    const handledData = handleRegisterErrors(error)

    expect(handledData).toEqual({
      statusCode: 500,
      error: 'Something else'
    })
  })
})