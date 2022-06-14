import { NextFunction, Request, Response } from "express"

import { deleteItemBySelector } from "../db/functions/basicCrud"
import {
  addRecipe,
  getRecipeById,
  getUsersRecipesByUserId,
  updateRecipe,
  userSavesRecipe,
} from "../db/functions/recipe"

import { JSONRecipe } from "../types/JSONRecipe"

export const addNewRecipe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jsonRecipe: JSONRecipe = req.body.recipe
    const userId = req.body.userId

    if (userId === undefined) {
      return res.status(400).json({ error: "No userId" })
    }

    if (jsonRecipe === undefined) {
      return res.status(400).json({ error: "No jsonRecipe" })
    }

    // add recipe and then add ingredients if needed
    const recipeId = await addRecipe(jsonRecipe)

    // add userRecipe join
    await userSavesRecipe(userId, recipeId)

    return res.status(201).json({ id: recipeId })
  } catch (err: unknown) {
    next(err)
  }
}

export const saveRecipe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recipeId = parseInt(req.params.recipeId)
    const userId: number = req.body.userId

    if (userId === undefined) {
      return res.status(400).json({ error: "No userId" })
    }

    const id = await userSavesRecipe(userId, recipeId)

    return res.status(201).json({ id })
  } catch (err: unknown) {
    next(err)
  }
}

export const getUserRecipes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.userId)

    const recipes = await getUsersRecipesByUserId(userId)

    return res.json({ recipes })
  } catch (err: unknown) {
    next(err)
  }
}

export const getRecipe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recipeId = parseInt(req.params.recipeId)

    const recipe = await getRecipeById(recipeId)

    return res.json({ recipe })
  } catch (err: unknown) {
    next(err)
  }
}

export const editRecipe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recipeId = parseInt(req.params.recipeId)
    const editedRecipe = req.body.editedRecipe as Partial<JSONRecipe>

    if (editedRecipe === undefined) {
      return res.status(400).json({ error: "No edited recipe" })
    }

    // update the recipe
    await updateRecipe(recipeId, editedRecipe)

    return res.json({ edited: true })
  } catch (err: unknown) {
    next(err)
  }
}

export const unsaveRecipe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const recipe_id = parseInt(req.params.recipeId)
    const user_id = req.body.userId

    if (user_id === undefined) {
      return res.status(400).json({ error: "No userId" })
    }

    // delete the recipe user connection for given user
    await deleteItemBySelector("user_recipes", { user_id, recipe_id })

    return res.json({ unsaved: true })
  } catch (err: unknown) {
    next(err)
  }
}
