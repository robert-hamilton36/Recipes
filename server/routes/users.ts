import express from 'express'

import { getUsers } from '../db/functions/users'

const usersRouter = express.Router()

usersRouter.get('/', (req, res) => {
  getUsers()
    .then(results => {
      return res.json({ users: results.map(fruit => fruit.firstName) })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: 'Somthing went wrong' })
    })
})

export default usersRouter
