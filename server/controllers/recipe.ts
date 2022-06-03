import { Request, Response } from "express";

import { deleteItemBySelector, getItemsBySelector } from "../db/functions/basicCrud";
import { addRecipe, deleteAllTraceOfRecipe, getRecipeById, getUsersRecipesByUserId, updateRecipe } from "../db/functions/recipe";

import { createRecipeDatabaseObject } from "../functions/createDatabaseObjects";
import { handleGetUpdateDeleteRecipes } from "../functions/errorHandlers";

import { JSONRecipe } from "../types/JSONRecipe";

export const addNewRecipe = async (req: Request, res: Response) => {
  const jsonRecipe: JSONRecipe = req.body.recipe
  const userId: number = req.body.userId

  const ingredients = jsonRecipe.ingredients

  try {
    const recipe = createRecipeDatabaseObject(jsonRecipe)
    const id = await addRecipe(recipe, ingredients, userId)

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
    const editedRecipe = req.body.edit as Partial<JSONRecipe>

    await updateRecipe(editedRecipe)
    res.json({ edited: true})
  } catch(e: unknown) {
    const {code, error} = handleGetUpdateDeleteRecipes(e)
    res.status(code).json({ edited: false, error })
  }
}

export const deleteRecipe = async (req: Request, res: Response) => {
  try {
    const recipe_id = parseInt(req.params.recipeId)
    const user_id = req.body.userId

    const usersWhoHaveSavedRecipe = await getItemsBySelector('user_recipes', {recipe_id})

    if (usersWhoHaveSavedRecipe.length === 1 && usersWhoHaveSavedRecipe[0].user_id === user_id) {
      // delete the whole recipe
      await deleteAllTraceOfRecipe(recipe_id)
    } else {
      // delete the recipe user connection for given user
      await deleteItemBySelector('user_recipes', {user_id, recipe_id})
    }
    res.json({deleted: true})
  } catch(e) {
    const {code, error} = handleGetUpdateDeleteRecipes(e)
    res.status(code).json({ error })
  }
}