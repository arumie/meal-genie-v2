"use client";

import LoadingSpinner from "@meal-genie/components/LoadingSpinner";
import NemligForm from "@meal-genie/components/forms/NemligForm";
import { PbIngredient, PbPlan } from "@meal-genie/types";
import classNames from "classnames";
import Image from "next/image";
import { useState } from "react";
import useSWR from "swr";
import { post } from "@meal-genie/lib/auth";
import ErrorMessage from "@meal-genie/components/Error";

export default function Plan({ params }: any) {
  const [openTab, setOpenTab] = useState(0);

  const ingredients = useSWR(`/api/mealplan/${params.id}/ingredients`, post);
  const plan = useSWR(`/api/mealplan/${params.id}/plan`, post);

  return (
    <main>
      {ingredients.isLoading || plan.isLoading ? (
        <>
          <div className="container m-auto mt-5 mb-5">
            <div className="flex place-content-center">
              <LoadingSpinner></LoadingSpinner>
            </div>
          </div>
        </>
      ) : (
        <>
          {ingredients.error != null || plan.error != null ? (
            <>
              <ErrorMessage
                error={ingredients.error ?? plan.error}
              ></ErrorMessage>
            </>
          ) : (
            <div className="container m-auto mt-5 mb-5">
              <div className="tabs tabs-boxed bg-base-100 mb-5 w-1/2 m-auto">
                {plan.data?.plan &&
                  plan.data.plan.map((day: PbPlan, index: number) => (
                    <a
                      key={index}
                      className={classNames({
                        "tab font-semibold": true,
                        "tab-active": openTab === index,
                      })}
                      onClick={() => setOpenTab(index)}
                    >
                      {day.day}
                    </a>
                  ))}
                <a
                  className={classNames({
                    "tab font-semibold": true,
                    "tab-active": openTab === plan.data?.plan.length ?? 0,
                  })}
                  onClick={() => setOpenTab(plan.data?.plan.length ?? 0)}
                >
                  Shopping list
                </a>
              </div>
              <div className="card bg-base-100 text-black w-1/2 m-auto shadow-xl">
                <div className="card-body">
                  {openTab === (plan.data?.plan.length ?? 0) ? (
                    <>
                      <div className="overflow-x-auto">
                        <table className="table table-compact w-full">
                          <tbody>
                            {ingredients.data &&
                              ingredients.data.map(
                                (ingredient: PbIngredient) => (
                                  <tr>
                                    <td className="capitalize">
                                      {ingredient.name}
                                    </td>
                                    <td>
                                      {ingredient.quantity} {ingredient.unit}
                                    </td>
                                  </tr>
                                )
                              )}
                          </tbody>
                        </table>
                        <a
                          className="btn btn-base-200 w-full normal-case mt-10"
                          href="#nemligModal"
                        >
                          Export to{" "}
                          <Image
                            className="ml-2"
                            id="nemlig-img"
                            src="/images/nemlig-web-logo.svg"
                            alt={"Nemlig.com"}
                            width={90}
                            height={80}
                          ></Image>
                        </a>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {plan.data?.plan &&
                    plan.data.plan.map((day: PbPlan, index: number) => (
                      <>
                        <div
                          className={classNames({
                            "flex flex-col max-w-none": true,
                            hidden: openTab !== index,
                          })}
                        >
                          {day.meals.map((meal, mealIndex) => (
                            <>
                              <h3 className="text-lg font-semibold mb-5">
                                {meal.description}
                              </h3>
                              <div className="grid grid-flow-col grid-cols-2 gap-5">
                                <div className="card rounded-box">
                                  <h4 className="font-semibold mb-5">Recipe</h4>
                                  {meal.directions.map((d) => (
                                    <p className="text-sm mb-5" key={d}>
                                      {d}
                                    </p>
                                  ))}
                                </div>
                                <div className="card rounded-box">
                                  <h4 className="font-semibold mb-5">
                                    Ingredients
                                  </h4>
                                  <ul className="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
                                    {meal.ingredients.map((i) => (
                                      <li className="text-sm" key={i.name}>
                                        {i.quantity} {i.unit} {i.name}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              {mealIndex !== day.meals.length - 1 ? (
                                <div className="divider"></div>
                              ) : (
                                <></>
                              )}
                            </>
                          ))}
                        </div>
                      </>
                    ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <div className="modal" id="nemligModal">
        <div className="modal-box">
          <NemligForm ingredients={ingredients.data}></NemligForm>
        </div>
      </div>
    </main>
  );
}
