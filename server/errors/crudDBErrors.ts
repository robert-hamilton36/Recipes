export class GetDBError extends Error {
  constructor(itemType?: string, id?: number) {
    if(itemType && id) {
      super(`Get failed: No ${itemType} with id: ${id} found`)
    } else {
      super("Get failed: Nothing with id found")
    }

    this.name = "DatabaseGetError"
  }
}

export class UpdateDBError extends Error {
  constructor(itemType?: string, id?: number) {
    if(itemType && id) {
      super(`Update failed: No ${itemType} with id: ${id} found`)
    } else {
      super("Update failed: Nothing with id found")
    }

    this.name = "DatabaseUpdateError"
  }
}

export class DeletionDBError extends Error {
  constructor(itemType?: string, id?: number) {
    if(itemType && id) {
      super(`Deletion failed: No ${itemType} with id: ${id} found`)
    } else {
      super("Deletion failed: Nothing with id found")
    }

    this.name = "DatabaseDeletionError"
  }
}