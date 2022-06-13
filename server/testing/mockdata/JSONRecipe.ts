import { JSONRecipe, JSONIngredient } from "../../types/JSONRecipe"

export const CaramelSliceJSONRecipe: JSONRecipe = {
  name: "Healthier Date Cashew Caramel Chocolate Slice",
  prepTime: {
    quantity: 15,
    unit: "mins",
  },
  cookingTime: {
    quantity: 30,
    unit: "mins",
  },
  ingredients: [
    {
      ingredient: "Dates",
      quantity: {
        unit: "g",
        quantity: 400,
      },
    },
    {
      ingredient: "Cashews",
      quantity: {
        unit: "cups",
        quantity: 2,
      },
    },
    {
      ingredient: "Oats",
      quantity: {
        unit: "cups",
        quantity: 1,
      },
    },
    {
      ingredient: "Coconut Thread",
      quantity: {
        unit: "cups",
        quantity: 0.75,
      },
    },
  ],
  instructions: [
    {
      stepNumber: 1,
      instructions:
        "mix oats and coconut thread together bake for 10 mins at 180 C",
    },
    {
      stepNumber: 2,
      instructions:
        "boil dates until softer pulp and blend together with cashews",
    },
    {
      stepNumber: 3,
      instructions:
        "Pour the date cashew mix on top of the base. Refridgerate for 4 hours",
    },
  ],
  notes:
    "Creating a healthier version seemed like mission impossible at first, but after four attempts I have made a healthy date cashew chocolate caramel slice that mimics the flavour, texture and all round deliciousness of the original",
}

export const CaramelSliceJSONRecipeWithIds: JSONRecipe = {
  recipeId: 1,
  name: "Healthier Date Cashew Caramel Chocolate Slice",
  prepTime: {
    quantity: 15,
    unit: "mins",
  },
  cookingTime: {
    quantity: 30,
    unit: "mins",
  },
  ingredients: [
    {
      ingredientId: 1,
      ingredient: "Dates",
      quantity: {
        unit: "g",
        quantity: 400,
      },
    },
    {
      ingredientId: 2,
      ingredient: "Cashews",
      quantity: {
        unit: "cups",
        quantity: 2,
      },
    },
    {
      ingredientId: 3,
      ingredient: "Oats",
      quantity: {
        unit: "cups",
        quantity: 1,
      },
    },
    {
      ingredientId: 4,
      ingredient: "Coconut Thread",
      quantity: {
        unit: "cups",
        quantity: 0.75,
      },
    },
  ],
  instructions: [
    {
      stepNumber: 1,
      instructions:
        "mix oats and coconut thread together bake for 10 mins at 180 C",
    },
    {
      stepNumber: 2,
      instructions:
        "boil dates until softer pulp and blend together with cashews",
    },
    {
      stepNumber: 3,
      instructions:
        "Pour the date cashew mix on top of the base. Refridgerate for 4 hours",
    },
  ],
  notes:
    "Creating a healthier version seemed like mission impossible at first, but after four attempts I have made a healthy date cashew chocolate caramel slice that mimics the flavour, texture and all round deliciousness of the original",
}

export const dateIngredient: JSONIngredient = {
  ingredient: "Dates",
  quantity: {
    quantity: 400,
    unit: "g",
  },
}

export const dateIngredientWithId: JSONIngredient = {
  ingredientId: 1,
  ingredient: "Dates",
  quantity: {
    quantity: 400,
    unit: "g",
  },
}
