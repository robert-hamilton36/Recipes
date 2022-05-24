export interface QuantityUnit {
  quantity: number;
  unit: string;
}

interface Ingredient {
  ingredientId?: number;
  ingredient: string;
  quantity: QuantityUnit;
}

interface Instruction {
  stepNumber: number;
  instructions: string;
}

interface IncomingJSONRecipe {
  name: string;
  cookingTime: QuantityUnit;
  prepTime: QuantityUnit;
  instructions: Instruction[];
  ingredients: Ingredient[];
  notes: string;
}