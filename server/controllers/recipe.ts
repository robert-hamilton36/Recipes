import { Request, Response } from "express";

import { deleteItemBySelector } from "../db/functions/basicCrud";
import { addRecipe, getRecipeById, getUsersRecipesByUserId, updateRecipe, userSavesRecipe } from "../db/functions/recipe";

import { handleGetUpdateDeleteRecipes } from "../functions/errorHandlers";

import { JSONRecipe } from "../types/JSONRecipe";

export const addNewRecipe = async (req: Request, res: Response) => {
  
  try {
    const jsonRecipe: JSONRecipe = req.body.recipe
    const userId = req.body.userId
    const recipeId = await addRecipe(jsonRecipe)
    await userSavesRecipe(userId, recipeId)

    res.json({ id: recipeId })
  } catch (e: unknown) {
    res.status(500).json({error: 'Something went wrong'})
  }
}

export const saveRecipe = async (req: Request, res: Response) => {
  const recipeId = parseInt(req.params.recipeId)
  const userId: number = req.body.userId

  try {
    const id = await userSavesRecipe(userId, recipeId)

    res.json({id})
  } catch (e: unknown) {
    res.status(500).json({error: 'Something went wrong'})
  }
}

export const getUserRecipes = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId)
    const recipes = await getUsersRecipesByUserId(userId)
    res.json({ recipes })
  } catch(e) {
    const {code, error} = handleGetUpdateDeleteRecipes(e)
    res.status(code).json({ error })
  }
}

export const getRecipe = async (req: Request, res: Response) => {
  try {
    const recipeId = parseInt(req.params.recipeId)
    const recipe = await getRecipeById(recipeId)
    res.json({ recipe })
  } catch(e) {
    const {code, error} = handleGetUpdateDeleteRecipes(e)
    res.status(code).json({ error })
  }
}

export const editRecipe = async (req: Request, res: Response) => {
  try {
    const recipeId = parseInt(req.params.recipeId)
    const editedRecipe = req.body.edit as Partial<JSONRecipe>

    await updateRecipe(recipeId, editedRecipe)
    res.json({ edited: true})
  } catch(e: unknown) {
    const {code, error} = handleGetUpdateDeleteRecipes(e)
    res.status(code).json({ edited: false, error })
  }
}

export const unsaveRecipe = async (req: Request, res: Response) => {
  try {
    const recipe_id = parseInt(req.params.recipeId)
    const user_id = req.body.userId
    // delete the recipe user connection for given user
    await deleteItemBySelector('user_recipes', {user_id, recipe_id})
    
    res.json({unsaved: true})
  } catch(e) {
    const {code, error} = handleGetUpdateDeleteRecipes(e)
    res.status(code).json({ error })
  }
}