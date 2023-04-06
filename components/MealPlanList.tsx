"use client";

import { PbMealPlan, PbPlan } from "@meal-genie/types";
import classNames from "classnames";
import { HiArrowsExpand } from "react-icons/hi";

async function getMealPlans() {
  const res = await fetch("/api/mealplan/list", { cache: "no-store" });
  const data: PbMealPlan[] = await res.json();
  return data;
}

export default function MealPlanList(props: {
  user: any;
  mealPlans: PbMealPlan[];
}) {
  const { user, mealPlans } = props;

  return (
    <>
      <div className="card-body">
        <h2 className="card-title">
          Welcome <span className="text-primary">{user?.model?.name}</span>!
        </h2>
        {mealPlans.length === 0 ? (
          <p>
            You have not created any meal plans yet. Click on{" "}
            <span className="text-primary uppercase">Create new meal plan</span>{" "}
            to get started?
          </p>
        ) : (
          <h3>
            Here are your{" "}
            <span className="text-primary">{mealPlans.length}</span> meal
            plan(s)
          </h3>
        )}
      </div>
      <div className="card-body bg-base-300 text-white">
        {mealPlans.length === 0 ? (
          <h2>No meal plans...</h2>
        ) : (
          <div className="carousel carousel-center">
            {mealPlans.map((mealPlan, index) => (
              <div
                key={mealPlan.id}
                id={`slide${index}`}
                className="carousel-item relative w-full"
              >
                <div className="m-auto">
                  <article className="prose text-base-100">
                    <h2 className="text-base-100">{mealPlan.name}</h2>
                    {mealPlan?.plan?.plan &&
                      mealPlan.plan.plan.map((plan: PbPlan) => (
                        <p key={plan.day}>
                          {plan.day}:{" "}
                          {plan?.meals &&
                            plan.meals.map((meal, index) => (
                              <span key={meal.description}>
                                {meal.description}{" "}
                                {index !== plan.meals.length - 1 && ","}{" "}
                              </span>
                            ))}
                        </p>
                      ))}
                  </article>
                </div>
                <div className="absolute flex justify-between transform -translate-y-1/2 left-2 right-2 top-1/2">
                  <a
                    href={`#slide${index - 1}`}
                    className={classNames({
                      "btn btn-circle btn-sm": true,
                      "btn-disabled": mealPlans.length === 1 || index === 0,
                    })}
                  >
                    ❮
                  </a>
                  <a
                    href={`#slide${(index + 1) % mealPlans.length}`}
                    className={classNames({
                      "btn btn-circle btn-sm": true,
                      "btn-disabled":
                        mealPlans.length === 1 ||
                        index === mealPlans.length - 1,
                    })}
                  >
                    ❯
                  </a>
                </div>
                <div className="card-action">
                  <a
                    href={`/plan/${mealPlan.id}`}
                    className="btn btn-base-200 btn-sm -ml-10"
                  >
                    Open
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
