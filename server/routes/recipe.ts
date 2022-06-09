import express from 'express'
import { addNewRecipe, editRecipe, getRecipe, getUserRecipes, saveRecipe, unsaveRecipe } from '../controllers/recipe'

const recipeRouter = express.Router()

recipeRouter.post('/add', addNewRecipe)
recipeRouter.post('/save/:recipeId', saveRecipe)
recipeRouter.get('/getUserRecipes/:userId', getUserRecipes)
recipeRouter.get('/getRecipe/:recipeId', getRecipe)
recipeRouter.patch('/edit/:recipeId', editRecipe)
recipeRouter.delete('/unsave/:recipeId', unsaveRecipe)

export default recipeRouter