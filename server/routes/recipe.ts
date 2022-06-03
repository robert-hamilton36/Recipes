import express from 'express'
import { addNewRecipe, deleteRecipe, editRecipe, getRecipe, getUserRecipes } from '../controllers/recipe'

const recipeRouter = express.Router()

recipeRouter.post('/add', addNewRecipe)
recipeRouter.get('/getUserRecipes/:userId', getUserRecipes)
recipeRouter.get('/getRecipe/:recipeId', getRecipe)
recipeRouter.patch('/edit', editRecipe)
recipeRouter.delete('/delete/:recipeId', deleteRecipe)

export default recipeRouter