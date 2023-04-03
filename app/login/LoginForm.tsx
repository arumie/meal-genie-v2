"use client";
import classNames from "classnames";
import { login } from "@meal-genie/lib/auth";
import { pb } from "@meal-genie/lib/pocketbase";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

function LoginForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const router = useRouter();

  const handleLogin = async (data: any) => {
    setLoading(true);

    try {
      console.log(data);
      
      const response = await login(data.username, data.password);
      if (response.status !== 200) {
        throw Error(response.statusText);
      }
      setStatus("Logged in successfully ✅");
      router.refresh();
      router.replace("/");
    } catch (e) {
      console.log(e);
      setStatus(`Unable to Signup: ${(e as Error).message}`);
    }
    setLoading(false);
  };

  return (
    <div>
      <form className="form-control" onSubmit={handleSubmit(handleLogin)}>
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
          className={classNames({ btn: true, "mt-14": true, loading: loading })}
          type="submit"
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
      <div className="divider">OR</div>
      <button className="btn w-full" onClick={() => router.replace("/signup")} disabled={loading}>
        Sign Up
      </button>
      {status && (
        <span className="alert alert-info mt-14">
          <h3 className="font-bold">Status:</h3>
          <div className="text-sm">{status}</div>
        </span>
      )}
    </div>
  );
}

export default LoginForm;
