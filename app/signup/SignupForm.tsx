"use client";
import classNames from "classnames";
import { login, signup } from "@meal-genie/lib/auth";
import { pb } from "@meal-genie/lib/pocketbase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

function SignupForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const router = useRouter();

  const handleSignup = async (data: any) => {
    setLoading(true);

    try {
      const response = await signup(
        data.name,
        data.username,
        data.email,
        data.password,
        data.confirmPassword,
        data.openaiToken
      );
      if (response.status !== 200) {
        throw Error(response.statusText);
      }
      setStatus("Signed up successfully ✅");
      router.refresh();
      router.replace("/login");
    } catch (e) {
      setStatus(`Unable to Signup: ${(e as Error).message}`);
    }
    setLoading(false);
  };

  return (
    <div>
      <form className="form-control" onSubmit={handleSubmit(handleSignup)}>
      <span className="divider"></span>
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          className={classNames({
            "input input-bordered input-sm": true,
            "input-error": errors.name,
          })}
          {...register("name", { required: true, disabled: loading })}
        />
        {errors.name && (
          <span className="label-text text-error">Please fill out.</span>
        )}

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
          <span className="label-text">Email</span>
        </label>
        <input
          className={classNames({
            "input input-bordered input-sm": true,
            "input-error": errors.email,
          })}
          {...register("email", { required: true, disabled: loading })}
          type="email"
        />
        {errors.email && (
          <span className="label-text text-error">Please fill out.</span>
        )}

        <label className="label">
          <span className="label-text">OpenAI API Token</span>
        </label>
        <input
          className={classNames({
            "input input-bordered input-sm": true,
            "input-error": errors.openaiToken,
          })}
          {...register("openaiToken", { required: true, disabled: loading })}
          placeholder="sk-..."
        />
        {errors.openaiToken && (
          <span className="label-text text-error">Please fill out.</span>
        )}

        <span className="divider mt-8 mb-2">Password</span>

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

        <label className="label">
          <span className="label-text">Confirm password</span>
        </label>
        <input
          className={classNames({
            "input input-bordered input-sm": true,
            "input-error": errors.username,
          })}
          {...register("confirmPassword", {
            required: true,
            disabled: loading,
          })}
          type="password"
        />
        {errors.username && (
          <span className="label-text text-error">Please fill out.</span>
        )}

        <button
          className={classNames({ btn: true, "mt-14": true, loading: loading })}
          type="submit"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign up"}
        </button>
      </form>
      {status && (
        <span className="alert alert-info mt-14">
          <h3 className="font-bold">Status:</h3>
          <div className="text-sm">{status}</div>
        </span>
      )}
    </div>
  );
}

export default SignupForm;
