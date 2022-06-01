 interface QuantityUnit {
  quantity: number;
  unit: string;
}

interface JSONIngredient {
  ingredientId?: number;
  ingredient: string;
  quantity: QuantityUnit;
}

interface Instruction {
  stepNumber: number;
  instructions: string;
}

export interface JSONRecipe {
  recipeId?: number;
  name: string;
  cookingTime: QuantityUnit;
  prepTime: QuantityUnit;
  instructions: Instruction[];
  ingredients: JSONIngredient[];
  notes: string;
}