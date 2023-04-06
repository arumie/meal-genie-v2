"use client";
import { login, post } from "@meal-genie/lib/auth";
import { NemligResult } from "@meal-genie/pages/api/nemlig";
import { PbIngredient } from "@meal-genie/types";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function NemligForm(props: { ingredients: PbIngredient[] }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [nemligResult, setNemligResult] = useState<NemligResult | null>(null);

  const handleExport = async (data: any) => {
    setLoading(true);
    setNemligResult(null);

    let response;

    try {
      response = await post(
        "/api/nemlig",
        JSON.stringify({
          username: data.username,
          password: data.password,
          productNames: props.ingredients.map((ingredient) => ingredient.name),
        })
      );
    } catch (e) {
      console.log(e);
    }
    setNemligResult(response);
    setLoading(false);
  };

  return (
    <div>
      <a href="#" className="btn btn-sm btn-circle absolute right-2 top-2">
        ✕
      </a>
      <form className="form-control" onSubmit={handleSubmit(handleExport)}>
        <h3 className="text-lg font-semibold">
          Use your Nemlig credentials and then click Nemligfy!
        </h3>
        <label className="label">
          <span className="label-text">Username</span>
        </label>
        <input
          className={classNames({
            "input input-bordered input-sm": true,
            "input-error": errors.username,
          })}
          {...register("username", { required: true, disabled: loading })}
        />
        {errors.username && (
          <span className="label-text text-error">Please fill out.</span>
        )}

        <label className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          className={classNames({
            "input input-bordered input-sm": true,
            "input-error": errors.username,
          })}
          {...register("password", { required: true, disabled: loading })}
          type="password"
        />
        {errors.username && (
          <span className="label-text text-error">Please fill out.</span>
        )}

        <button
          className={classNames({
            btn: true,
            "mt-8 normal-case": true,
            loading: loading,
          })}
          type="submit"
          disabled={loading}
        >
          {loading ? "Loading..." : "Nemligfy!"}
        </button>
      </form>
      {nemligResult != null && (
        <>
          <div className="divider font-semibold">Result</div>
          <div>Number of products: <span className="font-semibold">{nemligResult.itemsInBasket}</span></div>
          <div>Total price of products: <span className="font-semibold">{nemligResult.totalPrice}</span></div>
          <a className="btn btn-primary normal-case w-full mt-5" href="https://www.nemlig.com/basket" target="_blank">NemligBuy</a>
        </>
      )}
    </div>
  );
}
