export interface UserDatabase {
  userId: readonly number;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  createdAt?: string;
}

interface UserRecipeDatabase {
  userRecipesId: readonly number
  userId: readonly number
  recipeId: readonly number
}

interface RecipeDatabase {
  recipeId: readonly number;
  name: string;
  cookTimeQuantity: number;
  cookTimeUnit: string;
  prepTimeQuantity: number;
  prepTimeUnit: string;
  instructions: string;
  notes: string;
}

interface RecipeIngredientDatabase {
  recipeIngredientsId: readonly number;
  recipeId: readonly number;
  ingredientId: readonly number;
  ingredientName: string;
  quantityAmount: number;
  quantityUnit: string;
}

interface IngredientsDatabase {
  ingredientId: readonly number;
  name: string;
}
