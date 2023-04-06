"use client";

import classNames from "classnames";
import { useState } from "react";


const post = (url: string, body: string) =>
  fetch(url, {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).then((res) => res.json());

function NewMealPlanBtn() {
  const [loading, setLoading] = useState(false);

  const handleNewMealPlan = async () => {
    setLoading(true);
    const body = {
      days: 2,
      persons: 2,
      breakfast: false,
      lunch: false,
      dinner: true,
      preferences: null,
      ingredients: [],
      types: [],
      model: "gpt-4",
    };
    const init = await post(
      "/api/mealplan/init",
      JSON.stringify(body)
    ).catch((e: Error) => e);
    console.log("New plan: ", init);
    
    setLoading(false);
  };

  const handleGetPlan = async () => {
    setLoading(true);
    const body = {
      updatePlan: false,
      model: 'gpt-4',
    };
    await fetch(
      "/api/mealplan/4fc0bh2g5u7uti5/plan"
    ).catch((e: Error) => e);
    
    setLoading(false);
  };

  const handleUpdatePlan = async () => {
    setLoading(true);
    const init = await post(
      "/api/mealplan/4fc0bh2g5u7uti5/plan",
      JSON.stringify({})
    ).catch((e: Error) => e);
    
    setLoading(false);
  };

  const handleGetIngredients = async () => {
    setLoading(true);
    await fetch(
      "/api/mealplan/4fc0bh2g5u7uti5/ingredients"
    ).catch((e: Error) => e);
    
    setLoading(false);
  };

  const handleUpdateDay = async () => {
    setLoading(true);
    await post(
      "/api/mealplan/4fc0bh2g5u7uti5/days/1",
      JSON.stringify({})
    ).catch((e: Error) => e);
    
    setLoading(false);
  };

  const handleListMealplans = async () => {
    setLoading(true);
    await fetch(
      "/api/mealplan/list"
    ).catch((e: Error) => e);
    
    setLoading(false);
  };

  return (
    <>
      <button
        className={classNames({'btn btn-primary text-neutral': true, 'loading': loading})}
        onClick={handleNewMealPlan}
      >
        New Meal Plan
      </button>
      <button
        className={classNames({'btn btn-primary text-neutral': true, 'loading': loading})}
        onClick={handleGetPlan}
      >
        Get Plan
      </button>
      <button
        className={classNames({'btn btn-primary text-neutral': true, 'loading': loading})}
        onClick={handleUpdatePlan}
      >
        Update Plan
      </button>
      <button
        className={classNames({'btn btn-primary text-neutral': true, 'loading': loading})}
        onClick={handleGetIngredients}
      >
        Get Ingredients
      </button>
      <button
        className={classNames({'btn btn-primary text-neutral': true, 'loading': loading})}
        onClick={handleUpdateDay}
      >
        Update Day 1
      </button>
      <button
        className={classNames({'btn btn-primary text-neutral': true, 'loading': loading})}
        onClick={handleListMealplans}
      >
        Get all mealplans
      </button>
    </>
  );
}

export default NewMealPlanBtn;
