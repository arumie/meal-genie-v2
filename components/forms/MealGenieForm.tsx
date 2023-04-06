"use client";

import { post } from "@meal-genie/lib/auth";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

export type Values = {
  days?: number;
  persons?: number;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  preferences?: string;
  ingredients: {
    value?: string;
    days?: number;
  }[];
  types: {
    value?: string;
    days?: number;
  }[];
};

const ingredientOptions = [
  "pasta",
  "tomato",
  "egg",
  "curry",
  "rice",
  "potato",
  "onion",
  "garlic",
  "chicken",
  "beef",
  "pork",
  "fish",
  "shrimp",
  "beans",
  "cheese",
  "bread",
  "butter",
  "oil",
  "vinegar",
  "salt",
  "pepper",
  "sugar",
  "flour",
  "milk",
  "cream",
  "yogurt",
  "lemon",
  "lime",
  "orange",
  "apple",
  "banana",
  "strawberry",
  "blueberry",
  "raspberry",
  "blackberry",
  "avocado",
  "lettuce",
  "spinach",
  "kale",
  "carrot",
  "celery",
  "cucumber",
  "bell pepper",
  "chili pepper",
  "mushroom",
  "corn",
  "peas",
  "broccoli",
  "cauliflower",
  "zucchini",
  "eggplant",
  "pumpkin",
  "sweet potato",
  "soy sauce",
  "hoisin sauce",
  "fish sauce",
  "soybean oil",
  "sesame oil",
  "peanut oil",
  "mustard",
  "mayonnaise",
  "ketchup",
  "hot sauce",
  "bbq sauce",
  "honey",
  "maple syrup",
  "cinnamon",
  "nutmeg",
  "ginger",
  "vanilla extract",
];

const typeOptions = [
  { value: "american", label: "American" },
  { value: "chinese", label: "Chinese" },
  { value: "french", label: "French" },
  { value: "indian", label: "Indian" },
  { value: "italian", label: "Italian" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
  { value: "mexican", label: "Mexican" },
  { value: "thai", label: "Thai" },
  { value: "vietnamese", label: "Vietnamese" },
  { value: "mediterranean", label: "Mediterranean" },
  { value: "middle eastern", label: "Middle Eastern" },
  { value: "spanish", label: "Spanish" },
  { value: "indonesian", label: "Indonesian" },
  { value: "greek", label: "Greek" },
  { value: "cajun", label: "Cajun" },
  { value: "caribbean", label: "Caribbean" },
  { value: "african", label: "African" },
  { value: "brazilian", label: "Brazilian" },
  { value: "peruvian", label: "Peruvian" },
  { value: "argentinian", label: "Argentinian" },
];


function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function MealGenieForm() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: null,
      days: 2,
      people: 2,
      preferences: "",
      breakfast: false,
      lunch: false,
      dinner: true,
      types: [],
      ingredients: [],
    },
  });

  const [loading, setLoading] = useState(false);
  const [progess, setProgress] = useState(0);
  const router = useRouter();

  const handleNewMealPlan = async (data: any) => {
    setLoading(true);
    setProgress(10);
    const body = {
      name: data.name,
      days: data.days,
      persons: data.people,
      breakfast: data.breakfast,
      lunch: data.lunch,
      dinner: data.dinner,
      preferences: data.preferences,
      ingredients: data.ingredients.map((v: any) => v.value),
      types: data.types.map((v: any) => v.value),
      model: "gpt-4",
    };
    const init = await post("/api/mealplan/init", JSON.stringify(body));
    setProgress(50);
    const plan = post(`/api/mealplan/${init.id}/plan`, JSON.stringify({}))
      .then(() => setProgress(75))
      .catch((e) => console.log(e));
    const ingredients = post(
      `/api/mealplan/${init.id}/ingredients`,
      JSON.stringify({})
    )
      .then(() => setProgress(75))
      .catch((e) => console.log(e));

    await Promise.all([ingredients, plan]);
    setProgress(100);
    setLoading(false);
    router.push(`/plan/${init.id}`);
  };

  return (
    <>
      <form className="form-control" onSubmit={handleSubmit(handleNewMealPlan)}>
        {/*  */}

        <label className="label">
          <span className="label-text font-bold">Name</span>
        </label>
        <input
          type="text"
          className={classNames({
            "input input-bordered input-sm": true,
            "input-error": errors.name,
          })}
          {...register("name", { required: true, disabled: loading })}
        />
        <span className="grid grid-cols-3 gap-4">
          <span>
            <label className="label">
              <span className="label-text font-bold">Days</span>
            </label>
            <input
              type="number"
              className={classNames({
                "input input-bordered input-sm": true,
                "input-error": errors.days,
              })}
              {...register("days", { required: true, disabled: loading })}
            />
          </span>
          <span>
            <label className="label">
              <span className="label-text font-bold">People</span>
            </label>
            <input
              type="number"
              className={classNames({
                "input input-bordered input-sm": true,
                "input-error": errors.people,
              })}
              {...register("people", { required: true, disabled: loading })}
            />
          </span>
        </span>

        <span className="divider"></span>
        <span className="flex">
          <span className="w-52 mr-12">
            <h2 className="font-bold">Which meals?</h2>
            <label className="label cursor-pointer">
              <span className="label-text mr-4">Breakfast</span>
              <input
                type="checkbox"
                {...register("breakfast", {
                  required: false,
                  disabled: loading,
                })}
                className="checkbox checkbox-primary"
              />
            </label>
            <label className="label cursor-pointer">
              <span className="label-text mr-4">Lunch</span>
              <input
                type="checkbox"
                {...register("lunch", { required: false, disabled: loading })}
                className="checkbox checkbox-primary"
              />
            </label>
            <label className="label cursor-pointer">
              <span className="label-text mr-4">Dinner</span>
              <input
                type="checkbox"
                {...register("dinner", { required: false, disabled: loading })}
                className="checkbox checkbox-primary"
              />
            </label>
          </span>
          <span className="w-52">
            <h2 className="font-bold">Dietary preferences?</h2>
            <label className="label cursor-pointer">
              <span className="label-text mr-4">None</span>
              <input
                type="radio"
                value=""
                {...register("preferences", {
                  disabled: loading,
                })}
                className="radio radio-primary"
              />
            </label>
            <label className="label cursor-pointer">
              <span className="label-text mr-4">Vegetarian</span>
              <input
                type="radio"
                value="vegetarian"
                {...register("preferences", { disabled: loading })}
                className="radio radio-primary"
              />
            </label>
            <label className="label cursor-pointer">
              <span className="label-text mr-4">Vegan</span>
              <input
                type="radio"
                value="vegan"
                {...register("preferences", { disabled: loading })}
                className="radio radio-primary"
              />
            </label>
          </span>
        </span>
        <span className="divider"></span>

        <h3 className="font-bold">Cuisines</h3>
        <span className="label-text mr-4 mb-5">
          The meal plan must include following cuisines?
        </span>

        <Controller
          control={control}
          name="types"
          render={({ field: { onChange, onBlur, value, name, ref } }) => (
            <Select
              isLoading={loading}
              isDisabled={loading}
              onChange={onChange}
              isMulti={true}
              onBlur={onBlur}
              value={value}
              name={name}
              ref={ref}
              /* @ts-ignore */
              options={typeOptions}
            />
          )}
        />

        <span className="divider"></span>

        <h3 className="font-bold">Ingredients</h3>
        <span className="label-text mr-4 mb-5">
          The meal plan must include following ingredients?
        </span>

        <Controller
          control={control}
          name="ingredients"
          render={({ field: { onChange, onBlur, value, name, ref } }) => (
            <Select
              isLoading={loading}
              isDisabled={loading}
              onChange={onChange}
              isMulti={true}
              onBlur={onBlur}
              value={value}
              name={name}
              ref={ref}
              /* @ts-ignore */
              options={ingredientOptions.map((v) => {
                return { value: v, label: capitalizeFirstLetter(v) };
              })}
            />
          )}
        />
        <button
          className={classNames({
            "btn btn-primary mt-14 normal-case": true,
            loading: loading,
          })}
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating meal plan..." : "Create meal plan"}
        </button>

        <progress
          className="progress progress-primary w-full"
          value={progess}
          max="100"
        ></progress>
      </form>
    </>
  );
}

export default MealGenieForm;
