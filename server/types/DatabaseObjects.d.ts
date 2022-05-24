export interface UserDatabase {
  id: readonly number;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  created_at?: string;
}

interface UserRecipeDatabase {
  id: readonly number
  user_id: readonly number
  recipe_id: readonly number
}

interface RecipeDatabase {
  id: readonly number;
  name: string;
  cook_time_quantity: number;
  cook_time_unit: string;
  prep_time_quantity: number;
  prep_time_unit: string;
  instructions: string;
  notes: string;
}

interface RecipeIngredientDatabase {
  id: readonly number;
  recipe_id: readonly number;
  ingredient_id: readonly number;
  ingredient_name: string;
  quantity_amount: number;
  quantity_unit: string;
}

interface IngredientsDatabase {
  id: readonly number;
  name: string;
}
