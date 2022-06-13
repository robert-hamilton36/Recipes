// export class InsertDBError extends Error {
//   constructor() {
//     super("Insert failed")
//     this.name = "DatabaseAddError"
//   }
// }

import { Table } from "./basicCrud"

export class GetDBError extends Error {
  itemType: Table | null
  constructor(itemType?: Table) {
    if (itemType) {
      super(`Get failed: No ${itemType} found with given id`)
      this.itemType = itemType
    } else {
      super("Get failed: Nothing with given id found")
      this.itemType = null
    }
    Object.setPrototypeOf(this, GetDBError.prototype)
    this.name = "GetError"
  }
}

export class UpdateDBError extends Error {
  itemType: Table | null
  constructor(itemType?: Table) {
    if (itemType) {
      super(`Update failed: No ${itemType} found with given id`)
      this.itemType = itemType
    } else {
      super("Update failed: Nothing with given id found")
      this.itemType = null
    }
    Object.setPrototypeOf(this, UpdateDBError.prototype)
    this.name = "UpdateError"
  }
}

export class DeletionDBError extends Error {
  itemType: Table | null
  constructor(itemType?: Table) {
    if (itemType) {
      super(`Deletion failed: No ${itemType} found with given id`)
      this.itemType = itemType
    } else {
      super("Deletion failed: Nothing with given id found")
      this.itemType = null
    }
    Object.setPrototypeOf(this, DeletionDBError.prototype)
    this.name = "DeletionError"
  }
}
