import { GetDBError, UpdateDBError, DeletionDBError } from '../crudDBErrors'

describe('GetDbError()', () => {
  test('creates GetDBError without itemType', () => {
    const error = new GetDBError()
    expect(error?.itemType).toBeNull()
    expect(error.message).toBe("Get failed: Nothing with given id found")
    expect(error.name).toBe('GetError')
    expect(error instanceof GetDBError).toBe(true)
  })

  test('creates GetDBError with itemType: ingredients', () => {
    const error = new GetDBError('ingredients')
    expect(error?.itemType).toBe('ingredients')
    expect(error.message).toBe("Get failed: No ingredients found with given id")
    expect(error.name).toBe('GetError')
    expect(error instanceof GetDBError).toBe(true)
  })
})

describe('UpdateDBError()', () => {
  test('creates UpdateDBError without itemType', () => {
    const error = new UpdateDBError()
    expect(error?.itemType).toBeNull()
    expect(error.message).toBe("Update failed: Nothing with given id found")
    expect(error.name).toBe('UpdateError')
    expect(error instanceof UpdateDBError).toBe(true)
  })

  test('creates UpdateDBError with itemType: ingredients', () => {
    const error = new UpdateDBError('ingredients')
    expect(error?.itemType).toBe('ingredients')
    expect(error.message).toBe("Update failed: No ingredients found with given id")
    expect(error.name).toBe('UpdateError')
    expect(error instanceof UpdateDBError).toBe(true)
  })
})

describe('DeletionDBError()', () => {
  test('creates DeletionDBError without itemType', () => {
    const error = new DeletionDBError()
    expect(error?.itemType).toBeNull()
    expect(error.message).toBe("Deletion failed: Nothing with given id found")
    expect(error.name).toBe('DeletionError')
    expect(error instanceof DeletionDBError).toBe(true)
  })

  test('creates DeletionDBError with itemType: ingredients', () => {
    const error = new DeletionDBError('ingredients')
    expect(error?.itemType).toBe('ingredients')
    expect(error.message).toBe("Deletion failed: No ingredients found with given id")
    expect(error.name).toBe('DeletionError')
    expect(error instanceof DeletionDBError).toBe(true)
  })
})