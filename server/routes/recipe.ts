import express from 'express'
import { addRecipe } from '../db/functions/recipe'

import { parseJSONRecipeToPartialRecipeDatabaseObject } from '../utility/cleanJSONRecipeToDatabaseObjects'
import { IncomingJSONRecipe } from '../types/JSONRecipe'


const recipeRouter = express.Router()

recipeRouter.post('/', async (req, res) => {
  const jsonRecipe: IncomingJSONRecipe = req.body.recipe
  const userId: number = req.body.userId

  const ingredients = jsonRecipe.ingredients
  const recipe = parseJSONRecipeToPartialRecipeDatabaseObject(jsonRecipe)
  
  try {
    const id = await addRecipe(recipe, ingredients, userId)
    return res.json({ id })
  } catch (e:unknown) {
    return res.status(500).json({err: "failed"})
  }
})

recipeRouter.get('/', async (req, res) => {
  res.json({ implemented: false })
})

export default recipeRouter