export class InsertDBError extends Error {
  constructor() {
    super("Insert failed")
    this.name = "DatabaseAddError"
  }
}

export class GetDBError extends Error {
  constructor(itemType?: string) {
    if(itemType) {
      super(`Get failed: No ${itemType} found with given id`)
    } else {
      super("Get failed: Nothing with given id found")
    }

    this.name = "DatabaseGetError"
  }
}

export class UpdateDBError extends Error {
  constructor(itemType?: string) {
    if(itemType) {
      super(`Update failed: No ${itemType} found with given id`)
    } else {
      super("Update failed: Nothing with given id found")
    }

    this.name = "DatabaseUpdateError"
  }
}

export class DeletionDBError extends Error {
  constructor(itemType?: string) {
    if(itemType) {
      super(`Deletion failed: No ${itemType} found with given id`)
    } else {
      super("Deletion failed: Nothing with given id found")
    }

    this.name = "DatabaseDeletionError"
  }
}