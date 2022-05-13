import express from 'express'

import { addRecipeToDatabase } from '../functions/recipes'
import { IncomingJSONRecipe } from '../types/JSONRecipe'


const recipeRouter = express.Router()

recipeRouter.post('/', async (req, res) => {
  const jsonRecipe: IncomingJSONRecipe = req.body.recipe
  const userId: number = req.body.userId
  try {
    const id = await addRecipeToDatabase(jsonRecipe, userId)
    return res.json({ id })
  } catch (e:unknown) {
    return res.status(500).json({err: "failed"})
  }
})

recipeRouter.get('/', async (req, res) => {
  res.json({ implemented: false })
})

export default recipeRouter