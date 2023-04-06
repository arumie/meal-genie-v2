export type MealPlanParams = {
  name: string,
  days: string;
  persons: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  preferences?: string;
  ingredients: string[];
  types: string[];
  model: string;
};

const prompt =
  "Make a {days} day food plan for {people} people. {meals}{preferences}{ingredients}{types} Give me the answer in danish.";

export function getMealPlanPrompt(body: MealPlanParams) {
  var customPrompt = prompt
    .replace("{days}", body.days)
    .replace("{people}", body.persons)
    .replace("{meals}", getMeals(body))
    .replace("{preferences}", getPreferences(body))
    .replace("{ingredients}", getIngredientPreferences(body))
    .replace("{types}", getTypesPreferences(body));
  return customPrompt;
}

function getMeals(params: MealPlanParams): string {
  let res = [];
  if (params.breakfast) {
    res.push("breakfast");
  }
  if (params.lunch) {
    res.push("lunch");
  }
  if (params.dinner) {
    res.push("dinner");
  }

  if (res.length === 1) {
    return `Only include ${res[0]}. `;
  } else {
    return `Only include ${res.slice(0, -1).join(", ")} and ${
      res.slice(-1)[0]
    }. `;
  }
}

function getPreferences(params: MealPlanParams): string {
  if (params.preferences == null || params.preferences === "") {
    return "";
  }

  return `All meals should be ${params.preferences}. `;
}

function getIngredientPreferences(params: MealPlanParams): string {
  if (params.ingredients == null || params.ingredients.length === 0) {
    return "";
  }

  const i = params.ingredients.map(
    (ingredient) =>
      `The mealplan must include ${ingredient} for least one of the days`
  );

  return i.join(". ") + ". ";
}

function getTypesPreferences(params: MealPlanParams): string {
  if (params.types == null || params.types.length === 0) {
    return "";
  }

  const i = params.types.map(
    (type) => `The mealplan must include ${type} food for least one of the days`
  );

  return i.join(". ") + ". ";
}
